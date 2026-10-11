<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import { getDisplayText } from '$lib/config/account.types'

    let { selected = false } = $props()

    let account = {
        name: 'Wancavino',
        type: 'dealer',
        address: 'Montalban, Rizal'
    }
</script>

<div class="account-search-result">
    <div class="mb-4">
        <div class="flex items-start justify-between">
            <div class="mb-1 font-medium">
                {account.name}
            </div>
        </div>
        <div class="mb-1 text-xs text-gray-400">
            <span>{getDisplayText(account.type)}</span>
            <span class="mx-1">•</span>
            <span>{account.address}</span>
        </div>
    </div>

    {#if selected}
        <div class="selected badge badge-sm">Selected</div>
    {:else}
        <button type="button" class="set-btn btn btn-xs">
            <div class="icon">
                <Icon icon="boxicons:check-square-filled" />
            </div>
            <span>Select account</span>
        </button>
    {/if}
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-search-result {
        @apply p-4;

        &:nth-child(odd) {
            @apply bg-gray-50;
        }
    }

    .selected {
        @apply rounded border-none bg-(--c6) text-white;
    }

    .set-btn {
        @apply border-none bg-(--c6)/10 text-xs text-(--c6) no-underline;

        .icon {
            @apply inline-block;
        }
    }
</style>
