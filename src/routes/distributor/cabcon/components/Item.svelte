<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import type { CabconRow } from '$lib/types/cabcon'
    import state from '../cabcon.context.svelte'

    let { cabcon }: { cabcon: CabconRow } = $props()

    let date = $derived(
        cabcon.closeDate && !Number.isNaN(cabcon.closeDate.getTime())
            ? state.formatDate(cabcon.closeDate)
            : '—'
    )

    let updating = $derived(state.isUpdating(cabcon.id))
    let deleting = $derived(state.isDeleting(cabcon.id))
    let statusLabel = $derived(_.startCase(cabcon.status))
</script>

<div class="cabcon-item">
    <div class="main">
        <div class="code">
            <div class="code-month">{cabcon.codeMonth}</div>
            <div class="status">
                <span class="status-badge" class:open={cabcon.status === 'open'}>{statusLabel}</span
                >
            </div>
        </div>

        <div class="meta">
            <div class="date-line">
                <span class="date">
                    <span class="label">Close Date:</span>
                    {date}
                </span>
                {#if updating}
                    <span class="loading loading-xs loading-spinner"></span>
                {:else}
                    <button
                        type="button"
                        class="edit"
                        aria-label="Edit code of the month"
                        onclick={() => state.openEdit(cabcon)}
                    >
                        <Icon icon="bi:pencil" width="14" />
                    </button>
                {/if}
            </div>
            <div class="row-actions">
                <button
                    type="button"
                    class="action action-danger"
                    aria-label="Delete code of the month"
                    disabled={deleting}
                    onclick={() => state.requestDelete(cabcon)}
                >
                    {#if deleting}
                        <span class="loading loading-sm loading-spinner"></span>
                    {:else}
                        <Icon icon="bi:trash" width="14" />
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .main {
        @apply flex items-start justify-between gap-4;
    }

    .code {
        @apply min-w-0;
    }

    .code-month {
        @apply truncate font-semibold;
    }

    .meta {
        @apply flex flex-none flex-col items-end gap-2 text-xs text-gray-500;
    }

    .label {
        @apply font-medium;
    }

    .date-line {
        @apply flex items-center justify-end gap-1.5;
    }

    .date {
        @apply flex items-center gap-1;
    }

    .edit {
        @apply inline-flex cursor-pointer items-center justify-center rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600;
    }

    .row-actions {
        @apply flex items-center gap-1;
    }

    .action {
        @apply inline-flex cursor-pointer items-center justify-center rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60;
    }

    .action-danger {
        @apply hover:bg-red-50 hover:text-red-500;
    }

    .status-badge {
        @apply inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600;
    }

    .status-badge.open {
        @apply bg-green-50 text-green-600;
    }
</style>
