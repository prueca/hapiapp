import db from '$lib/drizzle'
import { deploymentStatus } from '$lib/config/deployment.status'
import { sql } from 'drizzle-orm'

export const load = async ({ locals }) => {
    const originId = locals.account?.id

    if (!originId) {
        return { data: [] }
    }

    const data = await db.query.deployment.findMany({
        where: (deployment, { eq, and, inArray }) =>
            and(
                eq(deployment.originId, originId),
                inArray(deployment.status, [deploymentStatus.PROCESSING, deploymentStatus.PENDING])
            ),
        with: {
            designation: true,
            deploymentItems: {
                with: {
                    freezer: true
                },
                where: (deploymentItem, { and, eq, isNull }) =>
                    and(
                        eq(deploymentItem.status, 'for deployment'),
                        isNull(deploymentItem.deletedAt)
                    ),
                orderBy: (deploymentItem, { desc }) => desc(deploymentItem.createdAt)
            }
        },
        orderBy: (deployment, { desc }) => [desc(deployment.deploymentDate)],
        extras: {
            deploymentItemCount:
                sql`(select count(*) from "deployment_item" where "deployment_item"."deployment_id" = "deployment"."id")`.as(
                    'deployment_item_count'
                )
        }
    })

    return { data }
}
