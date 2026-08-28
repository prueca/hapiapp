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
    limit?: number
    nextCursor?: string
    filter?: {
        name?: string
        companyCode?: string
    }
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
    limit: z.number().min(1).optional(),
    nextCursor: z.string().optional(),
    filter: z
        .object({
            name: z.string().optional(),
            companyCode: z.string().optional()
        })
        .optional(),
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
    let query: Json = {}
    let filter: Json = {}

    if (options?.nextCursor) {
        query.id = {
            [Op.gt]: options.nextCursor
        }
    }

    if (!_.isEmpty(options?.filter)) {
        if (options?.filter?.name) {
            filter.name = {
                [Op.iLike]: `%${options.filter.name}%`
            }
        }
        if (options?.filter?.companyCode) {
            filter.name = {
                [Op.iLike]: `%${options.filter.companyCode}%`
            }
        }

        filter = {
            [Op.or]: filter
        }
    }

    switch (account.type) {
        case accountTypes.DISTRIBUTOR:
            query = {
                ...query,
                [Op.or]: [
                    {
                        associateId: account.id,
                        type: accountTypes.DEALER,
                        ...filter
                    },
                    {
                        type: accountTypes.FRANCHISEE,
                        '$parent.associate_id$': account.id,
                        ...filter
                    }
                ]
            }
            break
        case accountTypes.DEALER:
            query = {
                ...query,
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
        where: query,
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

    const { account, nextCursor, filter, limit, sort } = validation.data
    const ok = await verifyAccess(locals, account)

    if (!ok) {
        error(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }

    const data = await fetch(account, { nextCursor, filter, limit, sort })

    return json(data)
}
