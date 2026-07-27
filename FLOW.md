# Application Flow

## Login to Home Page Flow

Typical flow for users loging-in

### Diagram

```mermaid
sequenceDiagram
    participant LoginPage
    participant HomePage

    LoginPage->>HomePage: User to enter username, password, company code, hit submit button to login
    HomePage-->>LoginPage: Logout
```

---

## General Cabcon Submission

The submission procedure is identical regardless of merchant type (distributor, dealer, or franchisee). Any freezer located on the merchant's premises is automatically assigned to them.

Flow:
Submit -> Validate -> Result

```mermaid
flowchart TD
    A[Submit Images/Barcode] --> B{Validate}

    B -- Matched --> C[Successful barcode with code of the month]
    B -- Mismatch --> D[Unsuccessful submission or missing images/barcode]
    B -- Manually Submitted --> E[Poor internet conditions manual submission]

    D --> F[Retry / Correct and Resubmit]
    F --> A

    E --> G[Manual entry completed Pending sync]
```

---

## Submission Outcomes

All flows share the same submission result handling:

### 1. Matched

- Successful submission of barcode with code of the month

### 2. Mismatch

- Unsuccessful submission of barcode with code of the month
- Submitted images without the barcode and code of the month

### 3. Manually Submitted

- Manual submission allowed where internet connections are in poor conditions

---

## Cabcon Submission Process

**Code of the Month Validation**

->> Api call to retrieve the current Cabcon Code of the Month

->> Retrieve the code of the month that is watermarked on the captured image

->> Validate the equality of retrieved code of the month (via api call) with the code of the month watermarked from the image (via tesseract)

**Barcode Validation**

->> Retrieve the barcode from the captured image (via html5qrcode)

->> Make api call to retrieve freezer with the barcode

**Submit**

->> Logically freezer/s are assigned automatically where it is deployed to merchant's premises as stated in the general cabcon submission

```mermaid
sequenceDiagram
    participant U as User
    participant S as Submission Service
    participant A as API
    participant R as Reader (Tesseract / html5qrcode)

    alt Good Internet Connection
        U->>S: Capture Freezer Images
        S->>A: Retrieve Code of the Month
        A-->>S: Return current code
        S->>R: Extract watermarked code from image
        R-->>S: Return watermark code
        S->>S: Validate codes match

        alt Code matched
            S->>R: Extract barcode from image
            R-->>S: Return barcode
            S->>A: Retrieve freezer by barcode
            A-->>S: Return freezer data
            S->>S: Assign freezers to merchant premises
            S-->>U: Cabcon Submitted Successfully - Matched Result
        else Code mismatch
            S-->>U: Mismatch Result (barcode/code not found)
        end
    else Poor Internet Connection
        U->>S: Submit Manually (no network)
        S-->>U: Manually Submitted - Pending sync
    end
```

## Hapistore Cabcon Submission (Home Page)

User navigates to freezer card, click on the capture button and redirects to capture page.

**Use case:** This flow handles 5 or less freezer assets on user's premises.

- store | convenience store | etc.

_Submission outcomes: [See above](#submission-outcomes)_

```mermaid
flowchart TD
    A[Freezer Card] --> B[Click Capture Button]
    B --> C[Redirect to Capture Page]
    C --> D[Submit Images/Barcode]
    D --> E{Submission Result}

    E -- Matched --> F[Successful barcode with code of the month]
    E -- Mismatch --> G[Unsuccessful barcode mismatch or missing images]
    E -- Manually Submitted --> H[Poor internet conditions manual submission]

    G --> I[Retry / Correct and Resubmit]
    I --> D

    H --> J[Manual entry completed Pending sync]
```

---

## Dealer Cabcon Submission (Home Page)

### Flow 1: Single Freezer Capture

User navigates to freezer card, click on the capture button and redirects to capture page.

**Use case:** Handles up to 5 freezers within the user's available time.

- store | warehouse | etc.

_Submission outcomes: [See above](#submission-outcomes)_

```mermaid
flowchart TD
    A[Freezer Card] --> B[Click Capture Button]
    B --> C[Redirect to Capture Page]
    C --> D[Submit Images/Barcode]
    D --> E{Submission Result}

    E -- Matched --> F[Successful barcode with code of the month]
    E -- Mismatch --> G[Unsuccessful barcode mismatch or missing images]
    E -- Manually Submitted --> H[Poor internet conditions manual submission]

    G --> I[Retry / Correct and Resubmit]
    I --> D

    H --> J[Manual entry completed Pending sync]
```

---

### Flow 2: Batch Capture

User may click on the capture button in the home page, after that the user redirects to capture page and later back on the app.

**Sequence on the premises:**
login → homepage → click capture button → redirect to capture page → capture multiple freezer barcodes

**Sequence out of the premises:**
login → homepage → navigate to /cabcon/pending-submission → do the submission activity

**Use case:** Handles 5 or more freezer assets. Users capture multiple freezers on-site and complete submissions later via the app.

- store | warehouse | etc.

_Submission outcomes: [See above](#submission-outcomes)_

```mermaid
flowchart TD
    A[Login] --> B[Home Page]

    B -- On Premises --> C[Capture Multiple Freezer Barcodes]
    B -- Out of Premises --> D[Navigate to /cabcon/pending-submission]

    D --> E[Submit Pending Submissions]

    E --> F{Submission Result}

    F -- Matched --> G[Successful barcode with code of the month]
    F -- Mismatch --> H[Unsuccessful barcode mismatch or missing images]
    F -- Manually Submitted --> I[Poor internet conditions manual submission]

    H --> J[Retry / Correct and Resubmit]
    J --> E

    I --> K[Manual entry completed Pending sync]
```

---

# Asset Tracking Flow

Track the deployment lifecycle of freezers — all originate straight from distributors' warehouses and are moved through to franchisee premises.

## Deployment Path

Two scenarios initiate the freeze lifecycle:

1. **Distributor-Initiated** — Distributor lists all freezer assets in warehouse inventory and assigns them for deployment; Dealer notified via dashboard, approves or rejects; once approved, freezers are dispatched in batches to existing franchisee premises and new franchisee premises (see Deployment Types below).
2. **Dealer-Initiated** — Dealer requests additional freeze assets from the system for store/warehouse storage at their premises; distribution fulfills the request after approval confirmation; once confirmed dispatches batched, assigned freezers to that dealer premise directly.

## Deployment Types

1. Deploy freezer(s) from the distributor to brand-new franchises.
2. Upgrade an existing franchise's current freezer with a new one.
3. Downgrade — assign a different model than previously installed.
4. Replace a broken/fractured unit at any store.

## Diagrams

### Distribution-Initiated Sequence

Freezers originate from distributor warehouses and ship to franchisee premises under two scenarios. This diagram covers the **Distribution-Initiated** path — distributor lists all freeze assets in inventory, submits assignment for deployment, dealer approves, then dispatches to new or existing franchisees based on deployment type (see Deployment Types →).

```mermaid
sequenceDiagram
    participant Dist as Distributor
    participant Deal as Dealer

    Note over Dist: Distribution-Initiated — Freezers originate from distributor warehouse

    Dist->>Deal: List all freeze assets in inventory for assignment; submit deploy list

    Deal-->>Dist: Confirm / approve via dashboard (batched to existing vs. new franchisees)
```

### Dealer Request Sequence

**Dealer-Initiated** — the dealer submits a request to add more freeze assets into their premises for store/warehouse storage. The sequence diagram shows Dealer → Distributor path directly — no scheduler in between, distribution fulfills after approval confirms dispatch. The batched freezer assignment is assigned according to the four Deployment Types (see Distribution Trigger Path).

```mermaid
sequenceDiagram
    participant Dist as Distributor
    participant Deal as Dealer

    Note over Deal,Dist: Dealer Request for Additional Assets — no scheduler

    Deal->>Dist: Submit freeze asset deployment request

    Dist-->>Deal: Confirm assignment; approve scheduled dispatch
```

---