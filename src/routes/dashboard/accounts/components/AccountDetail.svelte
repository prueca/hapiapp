<script lang="ts">
    import accounts, { type Merchant } from '../accounts.state.svelte'

    type Props = {
        merchant: Merchant
        onClose: () => void
    }

    let { merchant, onClose }: Props = $props()

    const detailFields = [
        { label: 'Company Code', key: 'company_code' },
        { label: 'Phone', key: 'phone' },
        { label: 'Address', key: 'address' },
        { label: 'ISR Code', key: 'isr_code' },
        { label: 'SAP Code', key: 'sap_code' },
        { label: 'Associate ID', key: 'associate_id' }
    ] as const
</script>

<div
    class="modal-open modal"
    role="dialog"
    aria-modal="true"
    tabindex={-1}
    aria-label="Account detail"
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    onclick={(e) => e.target === e.currentTarget && onClose()}
>
    <div class="modal-box max-h-85 overflow-auto">
        <div class="mb-4 flex items-start justify-between gap-4">
            <div>
                <p class="text-xl font-bold">{merchant.name.trim()}</p>
                <p class="text-sm text-gray-400">{merchant.account_type}</p>
            </div>
            <button class="btn btn-ghost btn-sm" onclick={onClose}>Close</button>
        </div>

        <dl class="detail">
            {#each detailFields as field}
                <div class="detail-row">
                    <dt>{field.label}</dt>
                    <dd>{merchant[field.key] || '—'}</dd>
                </div>
            {/each}
        </dl>

        <div class="modal-action">
            <button class="btn btn-ghost" onclick={onClose}>Close</button>
            <button class="btn btn-primary" onclick={() => accounts.goToUpdate(merchant)}
                >Update</button
            >
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .detail {
        @apply flex flex-col gap-2;
    }

    .detail-row {
        @apply flex justify-between gap-4 border-b border-gray-100 pb-2;

        dt {
            @apply text-xs text-gray-400;
        }

        dd {
            @apply text-sm font-medium;
        }
    }
</style>
