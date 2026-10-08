import _ from 'lodash'
import db from '$lib/drizzle'
import { eq, and, getTableColumns, gt, ilike, desc, asc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import * as t from '$lib/drizzle/schema'

const LIMIT = 12

export default async (data: Json) => {
    const { authAccount } = data

    const origin = alias(t.account, 'origin')
    const destination = alias(t.account, 'destination')
    const deploymentItem = alias(t.deploymentItem, 'deploymentItem')

    const conditions = [eq(t.deployment.originId, authAccount.id)]
    let sort = [desc(t.deployment.createdAt)]

    if (data.cursor) {
        conditions.push(gt(t.deployment.id, data.cursor))
    }

    if (data.query) {
        conditions.push(ilike(destination.name, `%${data.query}%`))
    }

    if (data.status) {
        conditions.push(eq(t.deployment.status, data.status))
    }

    if (data.sort) {
        switch (data.sort) {
            case 'deploymentDate-asc':
                sort.unshift(asc(t.deployment.deploymentDate))
                break

            case 'deploymentDate-desc':
                sort.unshift(desc(t.deployment.deploymentDate))
                break

            case 'status-asc':
                sort.unshift(asc(t.deployment.status))
                break

            case 'status-desc':
                sort.unshift(desc(t.deployment.status))
                break
        }
    }

    let items: Json[] = await db
        .select({
            ...getTableColumns(t.deployment),
            origin,
            destination,
            deploymentItem
        })
        .from(t.deployment)
        .innerJoin(origin, eq(origin.id, t.deployment.originId))
        .innerJoin(destination, eq(destination.id, t.deployment.destinationId))
        .leftJoin(deploymentItem, eq(deploymentItem.deploymentId, t.deployment.id))
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(...sort)
        .limit(LIMIT)

    /**
     * Transform items to proper shape to group deployment
     * items into array
     */

    items = _.values(_.groupBy(items, 'id')).map((rows) => ({
        ...rows[0],
        deploymentItem: undefined,
        deploymentItems: rows.map((row) => row.deploymentItem).filter(Boolean)
    }))

    const nextCursor = items.length ? _.last(items)!.id : null

    return { items, nextCursor }
}
