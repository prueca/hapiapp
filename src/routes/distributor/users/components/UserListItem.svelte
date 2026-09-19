<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import { getDisplayText } from '$lib/config/user.roles'
    import update from '../update.context.svelte'

    let { item, isLast = false } = $props()

    let fullName = $derived.by(() => {
        return item.middleName
            ? `${item.firstName} ${item.middleName} ${item.lastName}`
            : `${item.firstName} ${item.lastName}`
    })
</script>

<div class="user-list-item">
    <div class="flex items-start justify-between">
        <div class="mb-2 font-medium">
            {fullName}
        </div>
        <div class="dropdown dropdown-end" class:dropdown-top={isLast}>
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
                    <button onclick={() => null}>
                        <Icon icon="mdi:delete-outline" width="18" />
                        <span class="ml-1">Delete</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <div class="mb-1 text-xs text-gray-400">
        {getDisplayText(item.role)}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .user-list-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .dropdown-content {
        @apply z-1 w-52 rounded-lg p-2 shadow-sm;
    }

    .dropdown-content[popover] {
        position-try: flip-block;
    }

    .menu li > button:active {
        @apply bg-(--c4) text-(--font-color);
    }
</style>
