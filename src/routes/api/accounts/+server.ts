import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Op } from 'sequelize'
import accountTypes from '$lib/config/account.types'
import z from 'zod'
import _ from 'lodash'

import Account from '$lib/db/Account'

type SubjectAccount = {
    type: (typeof accountTypes)[keyof typeof accountTypes]
    id: string
}

type FetchOptions = {
    query?: string
    nextCursor?: string
    limit?: number
    sort?: {
        id?: 'asc' | 'desc'
        type?: 'asc' | 'desc'
        name?: 'asc' | 'desc'
        companyCode?: 'asc' | 'desc'
    }
}

const schema = z.object({
    account: z.object({
        type: z.enum([accountTypes.DISTRIBUTOR, accountTypes.DEALER, accountTypes.FRANCHISEE]),
        id: z.ulid()
    }),
    query: z.string().optional(),
    nextCursor: z.string().optional(),
    limit: z.number().min(1).optional(),
    sort: z
        .object({
            id: z.enum(['asc', 'desc']).optional(),
            type: z.enum(['asc', 'desc']).optional(),
            name: z.enum(['asc', 'desc']).optional(),
            companyCode: z.enum(['asc', 'desc']).optional()
        })
        .optional()
})

const verifyAccess = async (locals: App.Locals, account: SubjectAccount) => {
    const xy = `${locals.account?.type}:${account.type}`
    let descendant: Account | null = null

    switch (xy) {
        case `${accountTypes.DISTRIBUTOR}:${accountTypes.DISTRIBUTOR}`:
        case `${accountTypes.DEALER}:${accountTypes.DEALER}`:
        case `${accountTypes.FRANCHISEE}:${accountTypes.FRANCHISEE}`:
            return account.id === locals.account?.id

        case `${accountTypes.DISTRIBUTOR}:${accountTypes.DEALER}`:
        case `${accountTypes.DEALER}:${accountTypes.FRANCHISEE}`:
            descendant = await Account.findOne({
                where: account
            })

            return descendant?.associateId === locals.account?.id

        case `${accountTypes.DISTRIBUTOR}:${accountTypes.FRANCHISEE}`:
            descendant = await Account.findOne({
                where: account,
                include: [
                    {
                        model: Account,
                        as: 'parent', // dealer
                        include: [
                            {
                                model: Account,
                                as: 'parent' // distributor
                            }
                        ]
                    }
                ]
            })

            return descendant?.parent?.parent?.id === locals.account?.id
    }

    return false
}

const fetch = async (account: SubjectAccount, options?: FetchOptions) => {
    let where: Json = {}

    if (options?.nextCursor) {
        where.id = {
            [Op.gt]: options.nextCursor
        }
    }

    if (options?.query) {
        where = {
            ...where,
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${options.query}%`
                            }
                        },
                        {
                            companyCode: {
                                [Op.iLike]: `%${options.query}%`
                            }
                        }
                    ]
                }
            ]
        }
    }

    switch (account.type) {
        case accountTypes.DISTRIBUTOR:
            where = {
                ...where,
                [Op.or]: [
                    {
                        associateId: account.id,
                        type: accountTypes.DEALER
                    },
                    {
                        type: accountTypes.FRANCHISEE,
                        '$parent.associate_id$': account.id
                    }
                ]
            }
            break
        case accountTypes.DEALER:
            where = {
                ...where,
                [Op.and]: [
                    {
                        associateId: account.id,
                        type: accountTypes.FRANCHISEE
                    }
                ]
            }
            break
        default:
            error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    const findOptions: Json = {
        where,
        include: [
            {
                model: Account,
                as: 'parent',
                attributes: [],
                required: false
            }
        ],
        order: [['id', 'ASC']]
    }

    if (options?.limit) {
        findOptions.limit = options.limit + 1
    }

    if (options?.sort) {
        findOptions.order = [
            ['id', options.sort.id || 'asc'],
            ..._.map(options.sort, (order, column) => [column, order])
        ]
    }

    try {
        const items = await Account.findAll(findOptions)
        let nextCursor: string | undefined

        if (options?.limit && items.length > options.limit) {
            nextCursor = items.pop()?.id
        }

        return { items, nextCursor }
    } catch (e: any) {
        error(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
}

export const POST = async ({ locals, request }) => {
    const payload = await request.json()
    const validation = schema.safeParse(payload)

    if (!validation.success) {
        error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    const { account, query, nextCursor, limit, sort } = validation.data
    const ok = await verifyAccess(locals, account)

    if (!ok) {
        error(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }

    const data = await fetch(account, { query, nextCursor, limit, sort })

    return json(data)
}
