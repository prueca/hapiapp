import db from '$lib/drizzle'
import { freezerStatus } from '$lib/config/freezer.options'
import type { DeploymentGroup } from '$lib/types/deployment'
import _ from 'lodash'

export const load = async ({ locals }) => {
     const originId = locals.account?.id

     if (!originId) {
          return { groups: [] }
        }

     const rows = await db.query.deployment.findMany({
          where: (deployment, { eq, and }) =>
               and(
                    eq(deployment.originId, originId),
                    eq(deployment.status, freezerStatus.FOR_DEPLOYMENT)
              ),
          with: {
               designation: true,
               freezer: true
              },
          orderBy: (deployment, { desc, asc }) => [
               desc(deployment.deploymentDate),
               desc(deployment.designationId),
               asc(deployment.id)
          ]
        })

     const groups = groupDeployments(rows)

     return { groups }
 }

const groupDeployments = (rows: any[]): DeploymentGroup[] => {
     return _.chain(rows)
           .filter((row) => row.freezer && row.designation)
           .groupBy((row) => {
                const date = row.deploymentDate

                const dateKey = date instanceof Date && !Number.isNaN(date.getTime())
                     ? date.toISOString().slice(0, 10)
                     : ''

                return `${row.designation?.id ?? ''}:${dateKey}`
            })
           .map((members, key) => {
                const first = members[0]

                return {
                     key,
                     designation: first.designation,
                     deploymentDate: first.deploymentDate,
                     quantity: members.length,
                     freezers: members.map((row) => ({
                         ...row.freezer,
                         status: row.status,
                         deploymentId: row.id
                     }))
                }
            })
           .value()
}

