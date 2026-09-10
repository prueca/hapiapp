<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import del from '../delete.context.svelte'

    let { item } = $props()
</script>

<div class="account-list-item">
    <div class="flex items-center justify-between gap-4">
        <div>
            <div class="mb-1 font-medium">
                {item.name}
            </div>
            <div class="mb-1 text-xs text-gray-400">
                <span>{_.upperFirst(item.type)}</span>
                <span class="mx-1">•</span>
                <span>{item.address}</span>
            </div>
        </div>
        <div class="flex items-center gap-2 text-gray-400">
            <!-- <Icon icon="basil:caret-right-solid" /> -->
            <button class="btn btn-circle">
                <Icon icon="ci:note-edit" width="24" />
            </button>
            <button class="btn btn-circle" onclick={() => del.confirm(item.id)}>
                <Icon icon="mdi:delete-outline" width="24" />
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-list-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }
</style>
