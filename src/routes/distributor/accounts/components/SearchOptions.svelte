<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import accounts from '../accounts.context.svelte'

    const submit = () => {
        accounts.toggleSearchOptions()
        accounts.load()
    }
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
                    />
                </fieldset>

                <!-- account type -->
                <fieldset class="fieldset">
                    <label class="label">Account Type</label>
                    <select class="select w-full">
                        <option disabled={true} selected>Pick account type</option>
                        <option>All</option>
                        <option>Dealer</option>
                        <option>Franchisse</option>
                    </select>
                </fieldset>

                <!-- sort key -->
                <fieldset class="fieldset">
                    <label class="label">Sort By</label>
                    <select class="select w-full">
                        <option>Name</option>
                        <option>Company Code</option>
                    </select>
                </fieldset>

                <!-- sort order -->
                <fieldset class="fieldset">
                    <label class="label">Sort Order</label>
                    <select class="select w-full">
                        <option>Descending</option>
                        <option>Ascending</option>
                    </select>
                </fieldset>
            </div>
            <div class="modal-action">
                <button class="cancel-btn btn" onclick={() => accounts.toggleSearchOptions()}>
                    Cancel
                </button>
                <button class="search-btn btn" onclick={() => submit()}> Search </button>
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

    .search-btn {
        @apply cursor-pointer rounded-lg border-none bg-(--c1) text-white;
    }
    .cancel-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>
