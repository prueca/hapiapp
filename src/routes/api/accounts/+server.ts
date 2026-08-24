import '$lib/db'
import { json, error } from '@sveltejs/kit'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import accountTypes from '$lib/config/account.types'
import payload from '$lib/payload'
import z from 'zod'
import _ from 'lodash'

import Account from '$lib/db/Account'

type SubjectAccount = {
    type: (typeof accountTypes)[keyof typeof accountTypes]
    id: string
}

const schema = z.object({
    account: z.object({
        type: z.enum([accountTypes.DISTRIBUTOR, accountTypes.DEALER, accountTypes.FRANCHISEE]),
        id: z.ulid()
    }),
    children: z.boolean().optional()
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

const fetch = async (account: SubjectAccount, children = false) => {
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

    return Account.findOne(opts)
}

export const POST = async ({ locals, request }) => {
    const { account, children } = await payload(request, schema)
    const ok = await verifyAccess(locals, account)

    if (!ok) {
        error(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND)
    }

    const data = await fetch(account, children)

    return json({ data })
}
