<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import del from '../delete.context.svelte'
    import update from '../update.context.svelte'
    import { getDisplayText } from '$lib/config/account.types'

    let { item } = $props()
</script>

<div class="account-list-item">
    <div class="flex items-start justify-between">
        <div class="mb-2 font-medium">
            {item.name}
        </div>
        <div class="dropdown dropdown-end">
            <button class="btn -mt-1 p-0 btn-link btn-sm" tabindex="0">
                <span class="text-gray-500">
                    <Icon icon="octicon:ellipsis-16" width="20" />
                </span>
            </button>
            <ul class="dropdown-content menu bg-base-100">
                <li>
                    <button onclick={() => update.select(item.id)}>
                        <Icon icon="ci:note-edit" width="18" />
                        <span class="ml-1">Update</span>
                    </button>
                </li>
                <li>
                    <button onclick={() => del.confirm(item.id)}>
                        <Icon icon="mdi:delete-outline" width="18" />
                        <span class="ml-1">Delete</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <div class="mb-1 text-xs text-gray-400">
        <span>{getDisplayText(item.type)}</span>
        <span class="mx-1">•</span>
        <span>{item.address}</span>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-list-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .dropdown-content {
        @apply z-1 w-52 rounded-lg p-2 shadow-sm;
    }

    .menu li > button:active {
        @apply bg-(--c4) text-(--font-color);
    }
</style>
