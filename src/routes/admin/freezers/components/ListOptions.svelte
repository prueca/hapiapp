<script lang="ts">
    import StatusFilter from './StatusFilter.svelte'
    import { getListOptionsFlag, toggleListOptions } from '../store.svelte'
    import Icon from '@iconify/svelte'
</script>

<dialog id="freezer-details" class="modal" open={getListOptionsFlag()}>
    <div class="modal-box">
        <!-- close button -->
        <form method="dialog" onsubmit={() => toggleListOptions(false)}>
            <button
                class="close-btn btn btn-circle btn-ghost"
                onclick={() => toggleListOptions(false)}
            >
                <Icon icon="solar:close-square-bold" width="24" />
            </button>
        </form>
        <!-- modal title -->
        <h3 class="modal-title">Freezer List Options</h3>
        <!-- modal content -->
        <div class="modal-content">
            <StatusFilter />
        </div>
        <!-- modal action -->
        <div class="modal-action">
            <div class="flex items-center gap-4">
                <button class="btn btn-lg" onclick={() => toggleListOptions(false)}>
                    Cancel
                </button>
                <button class="btn btn-lg" onclick={() => toggleListOptions(false)}> Apply </button>
            </div>
        </div>
    </div>
    <!-- closes modal when clicked outside -->
    <form method="dialog" class="modal-backdrop" onsubmit={() => toggleListOptions(false)}>
        <button>close</button>
    </form>
</dialog>

<style lang="postcss">
    @reference 'tailwindcss';

    .modal-title {
        @apply mb-4 text-lg font-bold;
    }

    .modal-action {
        .btn {
            @apply w-28 rounded-lg bg-white/0 text-base;
        }
    }

    .close-btn {
        @apply absolute top-4 right-4 border-0 bg-white/0;
    }
</style>
