# Deployment Matrix Reference with Code Samples

```ts
export const originStatusEnum = pgEnum('origin_status', [
    'processing',
    'pending',
    'cancelled',
    'for-delivery',
    'in-transit',
    'delivered',
    'for-pullout',
    'subject-for-pullout',
    'for-replacement - broken-unit',
    'for-replacement - upgrade',
    'for-replacement - downgrade'
])

export const destinationStatusEnum = pgEnum('destination_status', [
    'processing',
    'pending',
    'cancelled',
    'to-receive',
    'received',
    'pullout-by-dealer',
    'pullout-by-distributor'
])

export const deployment = pgTable(
    'deployment',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
        originId: varchar('origin_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        originStatus: originStatusEnum('origin_status').notNull(), // processing, pending, cancelled, for-delivery, in-transit, delivered, for-pullout, subject-for-pullout, for-replacement - broken-unit, for-replacement - upgrade, for-replacement - downgrade
        destinationId: varchar('destination_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        destinationStatus: destinationStatusEnum('destination_status').notNull(), // to-receive, received, pullout-by-dealer, pullout-by-distributor
        deploymentDate: date('deployment_date', { mode: 'date' }),
        ...timestampMixin
    },
    (t) => [
        index('deployment_origin_status_date_idx').on(t.originId, t.originStatus, t.deploymentDate)
    ]
)
```

## 1. Distributor → Dealer

### Matrix Definition

| origin      | origin_status | designation | designation_status |
| ----------- | ------------- | ----------- | ------------------ |
| distributor | processing    | dealer      | processing         |
| distributor | pending       | dealer      | pending            |
| distributor | cancelled     | dealer      | cancelled          |

### Sample Payload

```json
{
    "deployment": {
        "originId": "distributor-123",
        "originStatus": "processing",
        "destinationId": "dealer-456",
        "destinationStatus": "processing",
        "deploymentItem": [
            {
                "designationId": "distributor-123",
                "status": "housed-available"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 1 — Distributor → Dealer (processing / pending / cancelled)
// Route: POST /api/distributor/deployments  ·  role: distributor-admin / distributor-user
// Caller (origin) is the logged-in distributor; destination is a dealer account.
// Filter: originStatus ∈ { processing, pending, cancelled } and destinationStatus mirrors it.

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { deployment, account } from '$lib/drizzle/schema'
import { originStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, inArray, isNull, desc, sql } from 'drizzle-orm'

const STATUS_SET = [originStatus.PROCESSING, originStatus.PENDING, originStatus.CANCELLED]

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!

        // ── role gate: distributor admin/user only ──
        if (account.type !== accountTypes.DISTRIBUTOR) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const filterStatus: string | undefined =
            validation.data.filterStatus && STATUS_SET.includes(validation.data.filterStatus)
                ? validation.data.filterStatus
                : undefined

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        // ── drizzle listing query ──
        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, inArray, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    eq(d.originId, account.id), // caller = origin
                    inArray(d.originStatus, filterStatus ? [filterStatus] : STATUS_SET),
                    // destination must be a dealer account
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.DEALER}
                           AND dst.deleted_at IS NULL
                    )`,
                    // name / address search across the destination dealer
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account dst
                             WHERE dst.id = ${d.destinationId}
                               AND (dst.name ILIKE ${likePattern}
                                     OR dst.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            extras: {
                deploymentItemCount: sql`(
                    select count(*) from deployment_item
                     where deployment_id = deployment.id and deleted_at is null
                )`.as('deployment_item_count' as any),
                overdue: sql`false`.as('overdue' as any) // processing/pending/cancelled have no due date
            },
            orderBy: (d, { desc, asc, sql }) =>
                (validation.data.sort === 'status-asc'
                    ? asc(d.originStatus)
                    : validation.data.sort === 'status-desc'
                      ? desc(d.originStatus)
                      : desc(d.deploymentDate)) as any,
            limit: cap + 1
        })

        // ── map to the JSON payload shape from §1 ──
        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                status: i.status
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null
        }))

        return json({ data: data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- **originId**: Unique identifier of the distributor account
- **originStatus**: Current status of the deployment from the distributor's perspective
- **destinationId**: Unique identifier of the dealer account receiving the deployment
- **destinationStatus**: Automatically set by the system based on the matrix
- **deploymentItem**: Array containing freezer details, including its current status
- **deploymentDate**: Date when the deployment was initiated (ISO 8601 format)

## 2. Distributor → Direct Store

### Matrix Definition

| origin      | origin_status | designation  | designation_status |
| ----------- | ------------- | ------------ | ------------------ |
| distributor | for-delivery  | direct-store | to-receive         |
| distributor | in-transit    | direct-store | to-receive         |
| distributor | delivered     | direct-store | received           |

### Sample Payload

```json
{
    "deployment": {
        "originId": "distributor-123",
        "originStatus": "for-delivery",
        "destinationId": "direct-store-789",
        "destinationStatus": "to-receive",
        "deploymentItem": [
            {
                "designationId": "distributor-123",
                "status": "deployed-designated"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 2 — Distributor → Direct Store (for-delivery / in-transit / delivered)
// Route: POST /api/distributor/deployments  ·  role: distributor-admin / distributor-user
// Caller (origin) is the distributor; destination is a `direct_store` account (e.g. 7-Eleven).
// Filter: originStatus ∈ { for-delivery, in-transit, delivered }.

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { originStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, inArray, isNull, desc, asc, sql } from 'drizzle-orm'

const STATUS_SET = [originStatus.FOR_DELIVERY, originStatus.IN_TRANSIT, originStatus.DELIVERED]

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        if (account.type !== accountTypes.DISTRIBUTOR) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const filterStatus: string | undefined =
            validation.data.filterStatus && STATUS_SET.includes(validation.data.filterStatus)
                ? validation.data.filterStatus
                : undefined

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, inArray, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    eq(d.originId, account.id),
                    inArray(d.originStatus, filterStatus ? [filterStatus] : STATUS_SET),
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.DIRECT_STORE}
                           AND dst.deleted_at IS NULL
                    )`,
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account dst
                             WHERE dst.id = ${d.destinationId}
                               AND (dst.name ILIKE ${likePattern}
                                     OR dst.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true, freezerId: true },
                    with: {
                        freezer: {
                            columns: {
                                id: true,
                                model: true,
                                brand: true,
                                capacity: true,
                                yearModel: true,
                                barcode: true
                            }
                        }
                    },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            extras: {
                deploymentItemCount: sql`(
                    select count(*) from deployment_item
                     where deployment_id = deployment.id and deleted_at is null
                )`.as('deployment_item_count' as any),
                overdue: sql`
                    CASE
                      WHEN deployment.origin_status IN ('for-delivery', 'in-transit')
                       AND deployment.deployment_date < CURRENT_DATE
                      THEN true ELSE false
                    END
                `.as('overdue' as any)
            },
            orderBy: (d, { desc, asc }) =>
                (validation.data.sort === 'status-asc'
                    ? asc(d.originStatus)
                    : validation.data.sort === 'status-desc'
                      ? desc(d.originStatus)
                      : desc(d.deploymentDate)) as any,
            limit: cap + 1
        })

        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                status: i.status,
                freezer: i.freezer ?? null
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null,
            overdue: (r as any).overdue as boolean,
            deploymentItemCount: (r as any).deploymentItemCount as number
        }))

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- This matrix handles deployments from distributor to direct accounts
- When `originStatus` is `for-delivery` or `in-transit`, `destinationStatus` is automatically set to `to-receive`
- When `originStatus` is `delivered`, the destination account must manually set `destinationStatus` to `received`

## 3. Dealer → Hapistore

### Matrix Definition

| origin | origin_status | designation | designation_status |
| ------ | ------------- | ----------- | ------------------ |
| dealer | for-delivery  | hapistore   | to-receive         |
| dealer | in-transit    | hapistore   | to-receive         |
| dealer | delivered     | hapistore   | received           |

### Sample Payload

```json
{
    "deployment": {
        "originId": "dealer-456",
        "originStatus": "in-transit",
        "destinationId": "hapistore-101",
        "destinationStatus": "to-receive",
        "deploymentItem": [
            {
                "designationId": "dealer-456",
                "status": "deployed-designated"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 3 — Dealer → Hapistore (for-delivery / in-transit / delivered)
// Route: POST /api/dealer/deployments  ·  role: dealer-admin / dealer-user
// Caller (origin) is the dealer; destination is a hapistore account.
// Filter: originStatus ∈ { for-delivery, in-transit, delivered }.

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { originStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, inArray, isNull, desc, asc, sql } from 'drizzle-orm'

const STATUS_SET = [originStatus.FOR_DELIVERY, originStatus.IN_TRANSIT, originStatus.DELIVERED]

const schema = z.object({
    sort: z.string().optional(),
    filterStatus: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        if (account.type !== accountTypes.DEALER) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const filterStatus: string | undefined =
            validation.data.filterStatus && STATUS_SET.includes(validation.data.filterStatus)
                ? validation.data.filterStatus
                : undefined

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, inArray, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    eq(d.originId, account.id),
                    inArray(d.originStatus, filterStatus ? [filterStatus] : STATUS_SET),
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.HAPISTORE}
                           AND dst.deleted_at IS NULL
                    )`,
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account dst
                             WHERE dst.id = ${d.destinationId}
                               AND (dst.name ILIKE ${likePattern}
                                     OR dst.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true, freezerId: true },
                    with: {
                        freezer: {
                            columns: {
                                id: true,
                                model: true,
                                brand: true,
                                capacity: true,
                                yearModel: true,
                                barcode: true
                            }
                        }
                    },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            extras: {
                deploymentItemCount: sql`(
                    select count(*) from deployment_item
                     where deployment_id = deployment.id and deleted_at is null
                )`.as('deployment_item_count' as any),
                overdue: sql`
                    CASE
                      WHEN deployment.origin_status IN ('for-delivery', 'in-transit')
                       AND deployment.deployment_date < CURRENT_DATE
                      THEN true ELSE false
                    END
                `.as('overdue' as any)
            },
            orderBy: (d, { desc, asc }) =>
                (validation.data.sort === 'status-asc'
                    ? asc(d.originStatus)
                    : validation.data.sort === 'status-desc'
                      ? desc(d.originStatus)
                      : desc(d.deploymentDate)) as any,
            limit: cap + 1
        })

        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                status: i.status,
                freezer: i.freezer ?? null
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null,
            overdue: (r as any).overdue as boolean,
            deploymentItemCount: (r as any).deploymentItemCount as number
        }))

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- Dealer-initiated deployments to hapistores follow similar logic to distributor deployments
- The `designationId` in deploymentItem points to the dealer's warehouse until the hapistore acknowledges receipt

## 4. Hapistore → Dealer (Pullout)

### Matrix Definition

| origin    | origin_status | designation | designation_status |
| --------- | ------------- | ----------- | ------------------ |
| hapistore | for-pullout   | dealer      | pullout-by-dealer  |

### Sample Payload

```json
{
    "deployment": {
        "originId": "hapistore-101",
        "originStatus": "for-pullout",
        "destinationId": "dealer-456",
        "destinationStatus": "pullout-by-dealer",
        "deploymentItem": [
            {
                "designationId": "hapistore-101",
                "status": "pullout"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 4 — Hapistore → Dealer (Pullout)
// Route: POST /api/dealer/deployments/pullout  ·  role: dealer-admin / dealer-user
// Caller (viewer) is the dealer who is the DESTINATION. Origin is a hapistore
// requesting pullout. originStatus = 'for-pullout', destinationStatus = 'pullout-by-dealer'.
// To reuse the same endpoint the hapistore may also call it (originId = account.id).

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { originStatus, destinationStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, or, isNull, desc, sql } from 'drizzle-orm'

const schema = z.object({
    sort: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!

        // Dealer (destination) OR hapistore (origin) caller — both may view
        // the same records from their own perspective.
        if (account.type !== accountTypes.DEALER && account.type !== accountTypes.HAPISTORE) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, or, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    // caller must be the origin (hapistore requesting) or the destination (dealer receiving)
                    or(eq(d.originId, account.id), eq(d.destinationId, account.id)),
                    eq(d.originStatus, originStatus.FOR_PULLOUT),
                    eq(d.destinationStatus, destinationStatus.PULLOUT_BY_DEALER),
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.DEALER}
                           AND dst.deleted_at IS NULL
                    )`,
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account src
                             WHERE src.id = ${d.originId}
                               AND (src.name ILIKE ${likePattern}
                                     OR src.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                origin: { columns: { id: true, name: true, type: true } },
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true, freezerId: true },
                    with: {
                        freezer: {
                            columns: {
                                id: true,
                                model: true,
                                brand: true,
                                capacity: true,
                                yearModel: true,
                                barcode: true
                            }
                        }
                    },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            orderBy: (d, { desc }) => desc(d.deploymentDate) as any,
            limit: cap + 1
        })

        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                status: i.status,
                freezer: i.freezer ?? null
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null
        }))

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- This matrix handles pullout requests from hapistores to dealers
- The `status` field in deploymentItem indicates the freezer's condition (e.g., `broken-unit`)
- The dealer is responsible for picking up the freezer and updating its status

## 5. Replacement Scenario

### Matrix Definition

| origin    | origin_status                 | designation | designation_status |
| --------- | ----------------------------- | ----------- | ------------------ |
| hapistore | for-replacement - broken-unit | dealer      | pullout-by-dealer  |

### Sample Payload

```json
{
    "deployment": {
        "originId": "hapistore-101",
        "originStatus": "for-replacement - upgrade",
        "destinationId": "dealer-456",
        "destinationStatus": "pullout-by-dealer",
        "deploymentItem": [
            {
                "designationId": "hapistore-101",
                "status": "for-replacement - upgrade"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 5 — Replacement Scenario (Hapistore → Dealer)
// Route: POST /api/dealer/deployments/pullout?type=replace
//   · role: dealer-admin / dealer-user (or hapistore-admin for own-request view)
// Caller views inbound replacement requests from hapistores.
// originStatus ∈ { for-replacement - broken-unit, for-replacement - upgrade, for-replacement - downgrade }
// destinationStatus = 'pullout-by-dealer'.
// The `status` on each deploymentItem reflects the freezer's condition
// (broken-unit, for-replacement - upgrade, for-replacement - downgrade, etc.).

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { originStatus, destinationStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, or, inArray, isNull, desc, sql } from 'drizzle-orm'

const REPLACEMENT_STATUSES = [
    originStatus.FOR_REPLACEMENT_BROKEN_UNIT,
    originStatus.FOR_REPLACEMENT_UPGRADE,
    originStatus.FOR_REPLACEMENT_DOWNGRADE
]

const schema = z.object({
    sort: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    // optional: narrow to a single replacement reason, otherwise include all three
    filterReason: z
        .nativeEnum(Object.fromEntries(REPLACEMENT_STATUSES.map((s) => [s, s])) as any)
        .optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        if (account.type !== accountTypes.DEALER && account.type !== accountTypes.HAPISTORE) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, inArray, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    or(eq(d.originId, account.id), eq(d.destinationId, account.id)),
                    inArray(
                        d.originStatus,
                        validation.data.filterReason
                            ? [validation.data.filterReason]
                            : REPLACEMENT_STATUSES
                    ),
                    eq(d.destinationStatus, destinationStatus.PULLOUT_BY_DEALER),
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.DEALER}
                           AND dst.deleted_at IS NULL
                    )`,
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account src
                             WHERE src.id = ${d.originId}
                               AND (src.name ILIKE ${likePattern}
                                     OR src.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                origin: { columns: { id: true, name: true, type: true } },
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true, freezerId: true },
                    with: {
                        freezer: {
                            columns: {
                                id: true,
                                model: true,
                                brand: true,
                                capacity: true,
                                yearModel: true,
                                barcode: true
                            }
                        }
                    },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            extras: {
                // surfaces the replacement reason that came in via originStatus
                // so the UI can show "broken unit" / "upgrade" / "downgrade" as a chip.
                replacementReason: sql`deployment.origin_status`.as('replacement_reason' as any)
            },
            orderBy: (d, { desc, asc }) =>
                (validation.data.sort === 'status-asc'
                    ? asc(d.originStatus)
                    : validation.data.sort === 'status-desc'
                      ? desc(d.originStatus)
                      : desc(d.deploymentDate)) as any,
            limit: cap + 1
        })

        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                // the per-item status carries the reason: e.g. 'for-replacement - upgrade'
                status: i.status,
                freezer: i.freezer ?? null
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null
        }))

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- This matrix handles replacement scenarios (upgrade, downgrade, broken unit)
- The `originStatus` field includes specific replacement types
- The dealer is responsible for handling the replacement process and updating the freezer's status

## 6. Dealer → Hapistore (Subject for Pullout)

### Matrix Definition

| origin | origin_status       | designation | designation_status |
| ------ | ------------------- | ----------- | ------------------ |
| dealer | subject-for-pullout | hapistore   | pullout-by-dealer  |

### Sample Payload

```json
{
    "deployment": {
        "originId": "dealer-456",
        "originStatus": "subject-for-pullout",
        "destinationId": "hapistore-101",
        "destinationStatus": "pullout-by-dealer",
        "deploymentItem": [
            {
                "designationId": "dealer-456",
                "status": "deployed-designated"
            }
        ],
        "deploymentDate": "2026-10-08"
    }
}
```

```ts
// Use case 6 — Dealer → Hapistore (Subject for Pullout)
// Route: POST /api/dealer/deployments/subject-for-pullout  ·  role: dealer-admin / dealer-user
// Caller (origin) is the dealer — initiating a pullout against a hapistore that is
// under review for below-target sales / freezer-reporting performance.
// originStatus = 'subject-for-pullout', destinationStatus = 'pullout-by-dealer'.
// The per-item `status` explains WHY (e.g. 'deployed-designated',
// 'below-target-performance').

import { json, error, isHttpError } from '@sveltejs/kit'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '$lib/drizzle'
import { originStatus, destinationStatus } from '$lib/config/deployment.status'
import accountTypes from '$lib/config/account.types'
import errors from '$lib/errors'
import _ from 'lodash'
import { eq, and, isNull, desc, asc, sql } from 'drizzle-orm'

const schema = z.object({
    sort: z.string().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional()
})

export const POST = async ({ request, locals }) => {
    try {
        const account = locals.account!
        if (account.type !== accountTypes.DEALER) {
            return json(
                { message: errors.UNAUTHORIZED.message },
                { status: StatusCodes.UNAUTHORIZED }
            )
        }

        const payload = await request.json()
        const validation = schema.safeParse(payload)
        if (!validation.success) {
            return json(
                { message: errors.INVALID_DATA_FORMAT.message },
                { status: StatusCodes.BAD_REQUEST }
            )
        }

        const cap = Math.min((validation.data.page ?? 1) * 12, 600)
        const likePattern = `%${_.trim(validation.data.query ?? '')}%`

        const rows = await db.query.deployment.findMany({
            where: (d, { and, eq, isNull }) =>
                and(
                    isNull(d.deletedAt),
                    eq(d.originId, account.id),
                    eq(d.originStatus, originStatus.SUBJECT_FOR_PULLOUT),
                    eq(d.destinationStatus, destinationStatus.PULLOUT_BY_DEALER),
                    sql`EXISTS (
                        SELECT 1 FROM account dst
                         WHERE dst.id = ${d.destinationId}
                           AND dst.type = ${accountTypes.HAPISTORE}
                           AND dst.deleted_at IS NULL
                    )`,
                    validation.data.query
                        ? sql`EXISTS (
                            SELECT 1 FROM account dst
                             WHERE dst.id = ${d.destinationId}
                               AND (dst.name ILIKE ${likePattern}
                                     OR dst.address ILIKE ${likePattern})
                         )`
                        : undefined
                ),
            with: {
                destination: { columns: { id: true, name: true, type: true } },
                deploymentItems: {
                    columns: { id: true, designationId: true, status: true, freezerId: true },
                    with: {
                        freezer: {
                            columns: {
                                id: true,
                                model: true,
                                brand: true,
                                capacity: true,
                                yearModel: true,
                                barcode: true
                            }
                        }
                    },
                    where: (di, { isNull }) => isNull(di.deletedAt),
                    orderBy: (di, { desc }) => desc(di.createdAt)
                }
            },
            extras: {
                deploymentItemCount: sql`(
                    select count(*) from deployment_item
                     where deployment_id = deployment.id and deleted_at is null
                )`.as('deployment_item_count' as any)
            },
            orderBy: (d, { desc, asc }) =>
                (validation.data.sort === 'status-asc'
                    ? asc(d.originStatus)
                    : validation.data.sort === 'status-desc'
                      ? desc(d.originStatus)
                      : desc(d.deploymentDate)) as any,
            limit: cap + 1
        })

        const data = rows.slice(0, cap).map((r) => ({
            originId: r.originId,
            originStatus: r.originStatus,
            destinationId: r.destinationId,
            destinationStatus: r.destinationStatus,
            deploymentItem: r.deploymentItems.map((i) => ({
                designationId: i.designationId,
                status: i.status,
                freezer: i.freezer ?? null
            })),
            deploymentDate: r.deploymentDate?.toISOString().slice(0, 10) ?? null,
            deploymentItemCount: (r as any).deploymentItemCount as number
        }))

        return json({ data })
    } catch (e: any) {
        if (isHttpError(e)) throw e
        const code = _.get(e, 'cause.code', null)
        switch (code) {
            case '23503':
                return (error as any)(
                    StatusCodes.UNPROCESSABLE_ENTITY,
                    errors.FOREIGN_KEY_VIOLATION
                )
            default:
                return (error as any)(StatusCodes.INTERNAL_SERVER_ERROR, {
                    ...errors.INTERNAL_ERROR,
                    message: e.message ?? errors.INTERNAL_ERROR.message
                })
        }
    }
}
```

### Documentation

- This matrix handles pullout scenarios initiated by dealers for hapistores with below-target performance
- `originStatus: "subject-for-pullout"` indicates the hapistore is under review for pullout
- `destinationStatus: "pullout-by-dealer"` is automatically set by the system
- `deploymentItem.status` explains the reason for pullout (e.g., "below-target-performance")
- Dealer is responsible for initiating the pullout process and documenting the reason
