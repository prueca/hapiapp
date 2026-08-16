<script lang="ts">
    import type { Product } from '$lib/types/product'

    let { product }: { product: Product } = $props()
</script>

<div class="freezer">
    <div class="section">
        <div class="flex items-start justify-between gap-2">
            <div class="name">{product.name}</div>
            <span class="category">{product.category}</span>
        </div>
        <div class="desc">{product.description}</div>
    </div>
    <div class="section">
        <div class="data">
            <div class="lbl">Size</div>
            <div class="val">{product.size_value} {product.size_unit}</div>
        </div>
        <div class="data">
            <div class="lbl">Packaging</div>
            <div class="val">{product.packaging}</div>
        </div>
    </div>
    <div class="section actions">
        <div class="price">₱{product.price}</div>
        <button class="btn btn-sm">Details</button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer {
        @apply mb-4 overflow-hidden rounded-lg border border-gray-200;
    }
    .section {
        @apply px-4 py-2;

        &.actions {
            @apply mt-2 mb-0 flex items-center justify-between gap-2 bg-gray-50 px-4 py-3;

            .btn {
                @apply rounded-lg border-none bg-(--c1) text-white;
            }
        }
    }
    .name {
        @apply font-medium text-(--font-color);
    }
    .category {
        @apply shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500;
    }
    .desc {
        @apply mt-1 text-sm text-gray-500;
    }
    .data {
        @apply mb-1 flex items-center justify-between gap-1;
    }
    .lbl {
        @apply text-gray-400;
    }
    .price {
        @apply text-lg font-semibold text-(--c1);
    }
</style>
