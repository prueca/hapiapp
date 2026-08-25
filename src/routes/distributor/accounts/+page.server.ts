import '$lib/db'
import accountTypes from '$lib/config/account.types'
import _ from 'lodash'

import Account from '$lib/db/Account'

type SubjectAccount = {
    type: (typeof accountTypes)[keyof typeof accountTypes]
    id: string
}

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

const flatten = (account: Account): Account[] => {
    return [account, ...(account.children ?? []).flatMap((b) => [b, ...(b.children ?? [])])]
}

export const load = async ({ locals }) => {
    const account = locals.account!
    const ok = await verifyAccess(locals, _.pick(account, ['type', 'id']))

    if (!ok) {
        return { ...locals, accounts: [] }
    }

    const ancestor = await fetch(account, true)

    if (!ancestor) {
        return { ...locals, accounts: [] }
    }

    const accounts = _.map(flatten(ancestor), (x) => x?.toJSON())

    return { ...locals, accounts }
}
