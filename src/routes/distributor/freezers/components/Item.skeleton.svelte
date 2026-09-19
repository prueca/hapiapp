<div class="freezer-item">
    <span class="barcode block w-1/2"></span>
    <span class="model block w-2/3"></span>
    <span class="meta block w-1/3"></span>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .freezer-item {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    .block {
        @apply my-1 rounded bg-gray-100;
    }

    .barcode {
        @apply mt-1 h-3;
    }

    .model {
        @apply h-4;
    }

    .meta {
        @apply h-3;
    }

    @media (prefers-reduced-motion: no-preference) {
        .block {
            @apply animate-pulse;
        }
    }
</style>
