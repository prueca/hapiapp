**Revised Deployment Schema**

```ts
export const deployment = pgTable(
    'deployment',
    {
        id: varchar('id', { length: 26 }).primaryKey().$defaultFn(ulid.generate),
        originId: varchar('origin_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        originStatus: originStatusEnum('origin_status').notNull(), // processing, pending, cancelled, for-delivery, in-transit, delivered
        destinationId: varchar('destination_id', { length: 26 })
            .references(() => account.id)
            .notNull(),
        destinationStatus: destinationStatusEnum('destination_status').notNull(), // to-recieve, received, cancelled
        deploymentDate: date('deployment_date', { mode: 'date' }),
        ...timestampMixin
    },
    (t) => [index('deployment_origin_status_date_idx').on(t.originId, t.status, t.deploymentDate)]
)
```

**Deployment Context**

_Deployment Matrix_

| origin      | designation  |
| ----------- | ------------ |
| distributor | dealer       |
| distributor | direct-store |
| distributor | hapistore    |
| dealer      | hapistore    |

---

_Deployment Status With Processing, Pending and Cancelled - (Internal Arrangement By Distributor Or Dealer)_

- data below is either a newly manufactured or refurbished freezer
- example payload when creating deployment with 'processing', 'pending' and 'cancelled' status
- the origin status 'processing', 'pending' and 'cancelled' are scope and responsibility only by distributor and dealer account

```json
{
    "deployment": {
      "originId": "distributor's id", // the distributor's id that is currently logged-in
      "originStatus": "processing | pending | cancelled",
      "destinationId": "destination id", // the selected dealer, hapistore or direct_store account id
      "destinationStatus": "processing | pending | cancelled", // the same values are intended for the implementation for easy query to be displayed on the ui
      "deploymentItem": [{
          "designationId": "distributor's id", // meaning the freezers are still under the distributor's responsibility and premise or warehouse
          "status": "housed-available" // meaning still available for deployment
        }],
        {...otherFields},
    }
}
```

---

_Deployment Status With For-Delivery And In-Transit - (Outgoing Freezer From The Origin Account And Incoming Freezer For Receiving Account)_

- data below is either a newly manufactured or refurbished freezer
- example payload when creating deployment with 'for-deployment' and 'in-transit'
- when 'for-delivery' or 'in-transit' is the origin status the designation status should be 'to-receive' and that should be set on the api or the server's code implementation by default
- when 'delivered' is the origin status the designation status 'received' should be set manually on the ui by the receiving account in this case the dealer, hapistore or the 'direct_store'
- the origin status 'for-delivery' and 'in-transit' are scope and responsibility only by distributor and dealer account

```json
{
    "deployment": {
      "originId": "distributor's id", // the distributor's id that is currently logged-in, meaning the account who is sending out the freezer
      "originStatus": "for-delivery | in-transit", // 'for-delivery' status is about to deliver, and 'in-transit' status is on the way event
      "destinationId": "destination id", // the selected dealer, hapistore or direct_store account id the freezer's to be delivered to
      "destinationStatus": "to-receive | received",
      "deploymentItem": [{
          "designationId": "id", // meaning the freezers are still under the distributor's responsibility and premise or warehouse and can it only be set when the receiving account received or acknowledge the delivery (designationId becomes the account id of the receiving account)
          "status": "housed-available" // meaning still available for deployment (status becomes 'deployed-designated when the receiving account acknowledge and received the freezer)
        }],
     {...otherDeploymentFields},
    }
}
```

**Pullout Context**

_Pullout Matrix_

| origin       | designation |
| ------------ | ----------- |
| hapistore    | dealer      |
| direct-store | distributor |
| dealer       | distributor |

_Deployment Status With For-Pullout - (Request From hapistore, direct_store or dealer)_

- this use case is when the account holder is withdrawing or not continuing the business and freezers may be re-deploy to other existing account holder or refurbished depends on freezer's condition
- this use case is also applicable in the event an account may wish the following
    - 'for-replacement - broken unit'
    - 'for-replacement - upgrade'
    - 'for-replacement - downgrade'
- this flow is scope or responsibilty by the distributor or the dealer for self-collecting or picking-up the freezer from the account wish to pullout the freezer
- below is an example payload

```json
{
    "deployment": {
      "originId": "id", // see pullout matrix
      "originStatus": "for-pullout | for-replacement - broken-unit | for-replacement upgrade | for-replacement - downgrade", // these are various request may occur from the requesting account
      "destinationId": "destination id", // see pullout matrix
      "destinationStatus": "to-receive | received", // the distributor or dealer to handle this manually to set on ui when the freezer's are on their premise/ warehouse stored
      "deploymentItem": [{
          "designationId": "id", // the account storing the freezer on their premise/ warehouse
          "status": "housed-available | broken-unit" // to be determine and set manually by the distributor or dealer depends on freezer condition for making new deployment either to re-deploy or send back to the distributor
        }],
     {...otherDeploymentFields},
    }
}
```
