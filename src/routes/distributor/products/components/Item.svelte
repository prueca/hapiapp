<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import type { ProductRow } from '$lib/types/product'
    import state from '../products.context.svelte'

    let { product }: { product: ProductRow } = $props()

    let size = $derived(
        product.sizeValue || product.sizeUnit
            ? [product.sizeValue, product.sizeUnit].filter(Boolean).join(' ')
            : '—'
    )

    let price = $derived(`₱${parseFloat(String(product.price)).toFixed(2)}`)
    let updating = $derived(state.isUpdating(product.id))
    let deleting = $derived(state.isDeleting(product.id))
    let categoryLabel = $derived(product.category ? _.startCase(product.category) : '—')
    let packagingLabel = $derived(product.packaging ? _.startCase(product.packaging) : '—')
</script>

<div class="product-item">
    <div class="main">
        <div class="head">
            <div class="name">{product.name}</div>
            <div class="status">
                <span class="status-badge">{categoryLabel}</span>
            </div>
        </div>

        {#if product.description}
            <div class="desc">{product.description}</div>
        {/if}

        <div class="meta">
            <div class="data">
                <span class="val">{price}</span>
            </div>
            <div class="row-actions">
                {#if updating}
                    <span class="loading loading-xs loading-spinner"></span>
                {:else}
                    <button
                        type="button"
                        class="edit"
                        aria-label="Edit product"
                        onclick={() => state.openEdit(product)}
                    >
                        <Icon icon="bi:pencil" width="14" />
                    </button>
                {/if}
                <button
                    type="button"
                    class="action action-danger"
                    aria-label="Delete product"
                    disabled={deleting}
                    onclick={() => state.requestDelete(product)}
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

    <div class="details">
        <div class="data">
            <span class="label">Packaging</span>
            <span class="val">{packagingLabel}</span>
        </div>
        {#if size !== '—'}
            <div class="data">
                <span class="label">Size</span>
                <span class="val">{size}</span>
            </div>
        {/if}
        {#if product.enlistedFor}
            <div class="data">
                <span class="label">Enlisted For</span>
                <span class="val">{_.startCase(product.enlistedFor)}</span>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .product-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .main {
        @apply flex items-start justify-between gap-4;
    }

    .head {
        @apply flex items-center gap-2;
    }

    .name {
        @apply truncate font-semibold;
    }

    .status {
        @apply flex-none;
    }

    .desc {
        @apply mt-1 text-sm text-gray-500;
    }

    .meta {
        @apply mt-2 flex items-center justify-between gap-2;
    }

    .row-actions {
        @apply flex flex-none items-center gap-1;
    }

    .edit {
        @apply inline-flex cursor-pointer items-center justify-center rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600;
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

    .details {
        @apply mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500;
    }

    .data {
        @apply flex items-center gap-1;

        .label {
            @apply font-medium;
        }
    }
</style>
