**Revised Deployment Schema**

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

---

**Deployment Context**

_Deployment Matrix - Processing, Pending and Cancelled - Distributor to Dealer_

| origin      | origin_status | designation | designation_status |
| ----------- | ------------- | ----------- | ------------------ |
| distributor | processing    | dealer      | processing         |
| distributor | pending       | dealer      | pending            |
| distributor | cancelled     | dealer      | cancelled          |

_Deployment Matrix - Processing, Pending and Cancelled - Distributor to Direct Store_

| origin      | origin_status | designation  | designation_status |
| ----------- | ------------- | ------------ | ------------------ |
| distributor | processing    | direct-store | processing         |
| distributor | pending       | direct-store | pending            |
| distributor | cancelled     | direct-store | cancelled          |

_Deployment Matrix - Processing, Pending and Cancelled - Distributor to Hapistore_

| origin      | origin_status | designation | designation_status |
| ----------- | ------------- | ----------- | ------------------ |
| distributor | processing    | hapistore   | processing         |
| distributor | pending       | hapistore   | pending            |
| distributor | cancelled     | hapistore   | cancelled          |

_Deployment Matrix - Processing, Pending and Cancelled - Dealer to Hapistore_

| origin | origin_status | designation | designation_status |
| ------ | ------------- | ----------- | ------------------ |
| dealer | processing    | hapistore   | processing         |
| dealer | pending       | hapistore   | pending            |
| dealer | cancelled     | hapistore   | cancelled          |

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

_Deployment Matrix - For Delivery, In-Transit And Delivered - Distributor To Dealer_

| origin      | origin_status | designation | designation_status |
| ----------- | ------------- | ----------- | ------------------ |
| distributor | for-delivery  | dealer      | to-receive         |
| distributor | in-transit    | dealer      | to-receive         |
| distributor | delivered     | dealer      | received           |

_Deployment Matrix - For Delivery And In-Transit And Delivered - Dealer to Hapistore_

| origin | origin_status | designation | designation_status |
| ------ | ------------- | ----------- | ------------------ |
| dealer | for-delivery  | hapistore   | to-recieve         |
| dealer | in-transit    | hapistore   | to-recieve         |
| dealer | delivered     | hapistore   | received           |

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

_Pullout Matrix - For Pullout - Hapistore to Dealer_

| origin    | origin_status | designation | designation_status |
| --------- | ------------- | ----------- | ------------------ |
| hapistore | for-pullout   | dealer      | pullout-by-dealer  |

_Pullout Matrix - For Pullout - Direct Store to Distributor_

| origin       | origin_status | designation | designation_status     |
| ------------ | ------------- | ----------- | ---------------------- |
| direct-store | for-pullout   | distributor | pullout-by-distributor |

_Pullout Matrix - For Pullout - Dealer to Distributor_

| origin | origin_status | designation | designation_status     |
| ------ | ------------- | ----------- | ---------------------- |
| dealer | for-pullout   | distributor | pullout-by-distributor |

_Pullout Matrix - Subject For Pullout - Dealer to Hapistore (Outlets With Below Target Performance On Sales And Freezer Reporting)_

| origin    | origin_status       | designation | designation_status |
| --------- | ------------------- | ----------- | ------------------ |
| hapistore | subject-for-pullout | dealer      | pullout-by-dealer  |

_Pullout Matrix - For Replacement - Hapistore To Dealer_

| origin    | origin_status                 | designation | designation_status |
| --------- | ----------------------------- | ----------- | ------------------ |
| hapistore | for-replacement - broken-unit | dealer      | pullout-by-dealer  |
| hapistore | for-replacement - upgrade     | dealer      | pullout-by-dealer  |
| hapistore | for-replacement - downgrade   | dealer      | pullout-by-dealer  |

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
