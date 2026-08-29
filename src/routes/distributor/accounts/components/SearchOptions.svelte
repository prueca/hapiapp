<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import accounts from '../accounts.context.svelte'
    import accountTypes from '$lib/config/account.types'
</script>

<div class="account-selection">
    <div class="modal" class:modal-open={accounts.openSearchOptions}>
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Search and filter accounts...</p>
            </div>
            <div>
                <!-- search field -->
                <fieldset class="fieldset">
                    <label class="label">Search Account</label>
                    <input
                        type="text"
                        id="name"
                        class="input w-full"
                        placeholder="Account name or company code"
                        bind:value={accounts.query}
                        onkeyup={() => accounts.filter()}
                    />
                </fieldset>

                <!-- account type -->
                <fieldset class="fieldset">
                    <label class="label">Account Type</label>
                    <select
                        class="select w-full"
                        bind:value={accounts.accountType}
                        onchange={() => accounts.filter()}
                    >
                        <option value="" disabled={true} selected>Pick account type</option>
                        <option value="">All</option>
                        <option value={accountTypes.DEALER}>Dealer</option>
                        <option value={accountTypes.FRANCHISEE}>Franchisse</option>
                    </select>
                </fieldset>

                <!-- sort key -->
                <fieldset class="fieldset">
                    <label class="label">Sort By</label>
                    <select
                        class="select w-full"
                        bind:value={accounts.sortBy}
                        onchange={() => accounts.filter()}
                    >
                        <option value="id" selected>ID</option>
                        <option value="name">Name</option>
                        <option value="companyCode">Company Code</option>
                    </select>
                </fieldset>

                <!-- sort order -->
                <fieldset class="fieldset">
                    <label class="label">Sort Order</label>
                    <select
                        class="select w-full"
                        bind:value={accounts.sortOrder}
                        onchange={() => accounts.filter()}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </fieldset>
            </div>
            <div class="modal-action">
                <button class="close-btn btn" onclick={() => accounts.toggleSearchOptions()}>
                    Close
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;

        input,
        select {
            @apply rounded-lg;
        }
    }
    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
