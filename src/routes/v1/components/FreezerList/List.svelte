<script lang="ts">
    import Icon from '@iconify/svelte'
    import Item from './Item.svelte'
</script>

<div class="mb-16">
    <div class="content-wrapper">
        <div class="section-title">
            <span class="text-lg">Freezers</span>
            <div class="action-buttons">
                <button class="btn btn-ghost btn-xs">
                    <Icon icon="icon-park-outline:search" width="22" />
                </button>
                <button class="btn btn-ghost btn-xs">
                    <Icon icon="icon-park-outline:add" width="22" />
                </button>
            </div>
        </div>
        <div class="filters">
            <div class="flex items-center">
                <button class="active btn btn-xs">All</button>
                <div class="btn-group">
                    <button class="btn btn-xs">Assigned</button>
                    <button class="btn btn-xs">Unassigned</button>
                    <button class="btn btn-xs">For Delivery</button>
                    <button class="btn btn-xs">For Pull Out</button>
                </div>
            </div>
        </div>
        <div class="list">
            <Item
                id="123456789"
                name="8cu Haier Curved Sliding Glass"
                dateAssigned="01 Jan 2020"
                cabcon="2020JANCAB"
            />
            <Item
                id="123456789"
                name="8cu Haier Curved Sliding Glass"
                dateAssigned="01 Jan 2020"
                cabcon="2020JANCAB"
            />
            <Item
                id="123456789"
                name="8cu Haier Curved Sliding Glass"
                dateAssigned="01 Jan 2020"
                cabcon="2020JANCAB"
            />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 flex items-center justify-between;
    }
    .action-buttons {
        @apply flex items-center gap-4;

        .btn {
            @apply px-0;
        }
    }
    .filters {
        @apply mb-4;

        .btn-group {
            @apply ml-4 flex items-center gap-2 overflow-x-auto border-l border-l-gray-200 pl-4 [scrollbar-width:none];
        }

        .btn {
            @apply rounded border-none text-sm text-(--font-color)/50;

            &.active {
                @apply border border-solid text-(--font-color);
            }
        }
    }
</style>
