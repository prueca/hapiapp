<script lang="ts">
    import Icon from '@iconify/svelte'
    import TopBar from '../../../components/TopBar'
</script>

<div class="content-wrapper">
    <TopBar />
    <div class="merchant p-4">
        <div class="px-4 pb-4">
            <h1 class="text-xl font-bold">Global Logistics Solutions</h1>
        </div>
        <nav class="nav px-4">
            <a href="/distributor">Home</a>
            <a href="/distributor/deployments">Deployments</a>
            <a href="/distributor/deployments/pullout" class="current">Pullout</a>
        </nav>
    </div>

    <!-- searching, sorting and filtering section -->
    <div class="toolbar">
        <label class="search">
            <Icon icon="bytesize:search" width="20" />
            <input type="search" placeholder="Search for Name or Address..." />
        </label>
        <button type="button" class="filter-btn" aria-label="Filter deployments">
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>

    <!-- listing section -->
    <ul class="container">
        <li class="sub-container">
            <div class="top-row">
                <div class="destination-status">pullout by distributor</div>
                <div class="deployment-date">Sep-10-2025, Thu</div>
            </div>
            <div class="mid-row">
                <div class="account-name">Global Logistics Solutions</div>
                <div class="account-type">dealer</div>
                <div class="account-address">456 Industrial St, Detroit, MI 48201</div>
            </div>
            <div class="listing-row">
                <button type="button" class="list-btn" aria-label="Toggle freezer list">
                    <Icon icon="carbon:list-boxes" width="24" />
                    <span class="count">5</span>
                </button>
                <span class="count-label">freezers</span>
            </div>
            <ul class="listing-freezer">
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
            </ul>
            <div class="btn-row">
                <button class="btn-receive btn">Receive</button>
            </div>
        </li>
        <li class="sub-container">
            <div class="top-row">
                <div class="destination-status">pullout by distributor</div>
                <div class="deployment-date">Aug-05-2025, Thu</div>
            </div>
            <div class="mid-row">
                <div class="account-name">Apex Retail Systems</div>
                <div class="account-type">dealer</div>
                <div class="account-address">789 Oak Rd, Chicago, IL 60601</div>
            </div>
            <div class="listing-row">
                <button type="button" class="list-btn" aria-label="Toggle freezer list">
                    <Icon icon="carbon:list-boxes" width="24" />
                    <span class="count">5</span>
                </button>
                <span class="count-label">freezers</span>
            </div>
            <ul class="listing-freezer">
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
            </ul>
            <div class="btn-row">
                <button class="btn-receive btn">Receive</button>
            </div>
        </li>
        <li class="sub-container">
            <div class="top-row">
                <div class="destination-status">pullout by distributor</div>
                <div class="deployment-date">Jul-20-2025, Mon</div>
            </div>
            <div class="mid-row">
                <div class="account-name">Summit Peak Retail</div>
                <div class="account-type">dealer</div>
                <div class="account-address">321 Pine Ln, Los Angeles, CA 90001</div>
            </div>
            <div class="listing-row">
                <button type="button" class="list-btn" aria-label="Toggle freezer list">
                    <Icon icon="carbon:list-boxes" width="24" />
                    <span class="count">5</span>
                </button>
                <span class="count-label">freezers</span>
            </div>
            <ul class="listing-freezer">
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
                <li class="item" data-status="pullout">
                    <div class="item-code">000123456789</div>
                    <div class="item-brand">Haier - Sliding Glass Freezer</div>
                    <div class="item-meta">12-cu-2023</div>
                </li>
            </ul>
            <div class="btn-row">
                <button class="btn-receive btn">Receive</button>
            </div>
        </li>
    </ul>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    :root {
        --border: var(--color-gray-200, #e5e7eb);
    }

    .merchant {
        background: linear-gradient(
            225deg,
            #ff6f70 0%,
            #ffa091 20%,
            #ffc7b1 40%,
            #ffe4d0 60%,
            #fff6ee 80%,
            #fffcff 100%
        );

        mask-image: linear-gradient(to bottom, black 0%, black 25%, transparent 100%);
    }

    /* Breadcrumb nav */
    .nav {
        @apply flex gap-4 py-3 text-sm text-gray-500;

        a {
            @apply font-semibold text-gray-900 hover:text-gray-700;
        }

        a.current {
            @apply font-semibold text-(--c1);
        }
    }

    /* Toolbar */
    .toolbar {
        @apply flex gap-2 border-b border-b-gray-100 p-4;
    }

    .search {
        @apply flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-(--c5) px-3 py-2 text-gray-500;

        input {
            @apply w-full grow border-none bg-transparent outline-none;
        }
    }

    .filter-btn {
        @apply shrink-0 rounded-lg border border-gray-200 bg-(--c5) px-3 text-gray-500 hover:text-(--c1);
    }

    /* Listing */
    .container {
        @apply flex flex-col gap-4 p-4 md:gap-6;
    }

    .sub-container {
        @apply rounded-lg border border-gray-200 bg-white p-4 shadow-sm;
    }

    /* Top row: pullout status + date, flex instead of float */
    .top-row {
        @apply flex items-center justify-between;
    }

    .destination-status {
        @apply rounded-sm bg-(--c1) px-2 py-0.5 text-xs font-medium text-white;
    }

    .deployment-date {
        @apply text-xs text-gray-400;
    }

    /* Account info block */
    .mid-row {
        @apply mt-3 flex flex-col gap-1;
    }

    .account-name {
        @apply text-base font-semibold text-gray-800;
    }

    .account-type {
        @apply text-xs tracking-wide text-gray-400 uppercase;
    }

    .account-address {
        @apply text-xs text-gray-400;
    }

    /* Action row: toggle + count */
    .listing-row {
        @apply mt-2.5 flex items-center gap-1.5 border-t border-gray-200 pt-3 text-sm font-medium;
    }

    .btn-row {
        margin-inline: auto;
        margin-block: 1rem;
        border-radius: 1rem;
        background-color: var(--c1);
    }

    .btn-receive {
        display: flex;
        margin-inline: auto;
        border: none;
        background-color: inherit;
        color: var(--c5);
    }

    .list-btn {
        @apply flex items-center text-gray-500 hover:text-(--c1);
    }

    .count {
        @apply ml-2 rounded-sm bg-(--c1) px-1.5 text-xs text-white;
    }

    .count-label {
        @apply text-xs font-normal text-gray-500;
    }

    /* Freezer list */
    .listing-freezer {
        @apply mt-3 flex flex-col gap-2;
    }

    .item {
        @apply relative mt-3 flex flex-col gap-0.5 rounded-lg bg-gray-50 p-3;

        &[data-status='pullout']::before {
            @apply absolute -top-2 right-3 bg-(--c1) px-3 py-0.5 text-[0.625rem] font-medium tracking-wider uppercase;
            content: attr(data-status);
            color: var(--c5);
            border-radius: 0.5rem;
        }
    }

    .item-code {
        @apply text-sm font-medium text-gray-800;
    }

    .item-brand {
        @apply text-sm text-gray-600;
    }

    .item-meta {
        @apply text-xs text-gray-400;
    }
</style>
