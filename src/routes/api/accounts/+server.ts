import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import z from 'zod'
import _ from 'lodash'

import Account from '$lib/db/Account'

const schema = z.object({
    account: z.object({
        type: z.enum([accountTypes.DISTRIBUTOR, accountTypes.DEALER, accountTypes.FRANCHISEE]),
        id: z.ulid()
    }),
    children: z.boolean().optional()
})

const verifyAccess = async (
    locals: App.Locals,
    account: {
        type: (typeof accountTypes)[keyof typeof accountTypes]
        id: string
    }
) => {
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

export const POST = async ({ locals, request }) => {
    if (!locals.isAuthenticated) {
        throw error(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
    }

    const body = await request.json()
    const payload = schema.safeParse(body)

    if (!payload.success) {
        error(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    }

    const { account, children } = payload.data
    const ok = await verifyAccess(locals, account)

    if (!ok) {
        error(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }

    const opts: Json = {
        where: _.pick(account, ['type', 'id']),
        attributes: ['type', 'id', 'name', 'companyCode']
    }

    if (children) {
        switch (account.type) {
            case accountTypes.DISTRIBUTOR:
                // In this case, we fetch from distributor to franchisee level.

                opts.include = [
                    {
                        model: Account,
                        as: 'children',
                        attributes: opts.attributes,
                        include: [
                            {
                                model: Account,
                                as: 'children',
                                attributes: opts.attributes
                            }
                        ]
                    }
                ]
                break

            case accountTypes.DEALER:
                // In this case, we fetch from dealer to franchisee level.

                opts.include = [
                    {
                        model: Account,
                        as: 'children',
                        attributes: opts.attributes
                    }
                ]
                break
        }
    }

    const data = await Account.findOne(opts)

    return json({ data })
}
