<script lang="ts">
    import Icon from '@iconify/svelte'
    import { getFreezerDetailsFlag, toggleFreezerDetails } from '../store.svelte'

    const details = [
        {
            label: 'Barcode',
            value: '1234567890'
        },
        {
            label: 'Brand',
            value: 'Haier'
        },
        {
            label: 'Capacity',
            value: 'cu'
        },
        {
            label: 'Model',
            value: 'Curved Sliding Glass'
        },
        {
            label: 'Year',
            value: '2020'
        }
    ]
</script>

<dialog id="freezer-details" class="modal" open={getFreezerDetailsFlag()}>
    <div class="modal-box">
        <!-- close button -->
        <form method="dialog" onsubmit={() => toggleFreezerDetails(false)}>
            <button
                class="close-btn btn btn-circle btn-ghost"
                onclick={() => toggleFreezerDetails(false)}
            >
                <Icon icon="solar:close-square-bold" width="24" />
            </button>
        </form>
        <!-- freezer status -->
        <div class="freezer-status">Active</div>
        <!-- freezer details -->
        <div class="freezer-details">
            {#each details as item}
                <div class="details-item">
                    <div class="item-label">{item.label}</div>
                    <div class="item-value">{item.value}</div>
                </div>
            {/each}
        </div>
        <div>
            <div class="divider"></div>
            <div class="font-medium">Report</div>
            <div class="divider"></div>
        </div>
        <!-- cabcon -->
        <div class="cabcon">
            <div class="cabcon-label">CABCON</div>
            <div class="cabcon-code">CABCONJAN2020</div>
        </div>
        <!-- modal actions -->
        <div class="modal-action">
            <div class="flex items-center gap-4">
                <button class="btn btn-lg" onclick={() => toggleFreezerDetails(false)}>
                    Upload
                </button>
                <button class="btn btn-lg" onclick={() => toggleFreezerDetails(false)}>
                    Verify
                </button>
                <button class="btn btn-lg" onclick={() => toggleFreezerDetails(false)}>
                    Submit
                </button>
            </div>
        </div>
    </div>
    <!-- closes modal when clicked outside -->
    <form method="dialog" class="modal-backdrop" onsubmit={() => toggleFreezerDetails(false)}>
        <button>close</button>
    </form>
</dialog>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer-status {
        @apply mb-4 text-2xl font-bold;
    }

    .freezer-details {
        @apply space-y-2;

        .details-item {
            @apply grid grid-cols-[100px_1fr];

            .item-label {
                @apply text-gray-500;
            }

            .item-value {
                @apply font-medium;
            }
        }
    }

    .cabcon {
        @apply flex items-baseline justify-between gap-4;

        .cabcon-label {
            @apply text-xl font-medium;
        }
    }

    .modal-action {
        @apply grid grid-cols-3 justify-normal gap-4;

        .btn {
            @apply w-full rounded-lg bg-white/0 text-base;
        }
    }

    .close-btn {
        @apply absolute top-4 right-4 border-0 bg-white/0;
    }
</style>
