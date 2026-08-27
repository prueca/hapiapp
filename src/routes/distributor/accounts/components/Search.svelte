<script lang="ts">
    import Icon from '@iconify/svelte'
    import search from '../search.context.svelte'

    const onkeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            search.submit()
        }
    }
</script>

<div class="border-b border-b-gray-100 p-4">
    <div class="flex gap-2">
        <!-- Search -->
        <div class="join w-full">
            <div class="grow">
                <label class="input w-full rounded-l-md">
                    <Icon icon="bytesize:search" width="20" />
                    <input type="search" class="grow" placeholder="Search" {onkeydown} />
                </label>
            </div>
            <button type="button" class="btn rounded-r-md" onclick={() => search.submit()}>
                Search
            </button>
        </div>

        <!-- Account type -->
        <!-- <select class="account-type">
            <option value="">All types</option>
            <option value="distributor">Distributor</option>
            <option value="dealer">Dealer</option>
            <option value="franchisee">Franchisee</option>
        </select> -->

        <!-- Sort By -->
        <!-- <select class="sort">
            <option value="name">Name</option>
        </select> -->

        <!-- Sort Order -->
        <!-- <button type="button" class="btn rounded-md">
            &#8595;
        </button> -->

        <button type="button" class="btn rounded-md" onclick={() => search.toggleSearchOptions()}>
            <Icon icon="bi:filter" width="24" />
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    /*.account-type {
        @apply rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-700 outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100;
    }

    .sort {
        @apply rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm text-gray-700 outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100;
    }*/
</style>
