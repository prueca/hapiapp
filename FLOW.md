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
