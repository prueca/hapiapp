import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Op } from 'sequelize'
import accountTypes from '$lib/config/account.types'
import z from 'zod'
import _ from 'lodash'

import Account from '$lib/db/Account'

type ScopedAccount = {
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

const fetch = async (account: ScopedAccount, options?: FetchOptions) => {
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

        const data = { items, nextCursor }

        return { data }
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

    const { query, nextCursor, limit, sort } = validation.data

    const data = await fetch(locals.account!, { query, nextCursor, limit, sort })

    return json(data)
}
