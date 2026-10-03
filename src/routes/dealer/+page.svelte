<script lang="ts">
    import Dock from '../components/Dock.svelte'
    import MerchantName from '../components/MerchantName.svelte'
    import TopBar from '../components/TopBar'
    import type { ProductRow } from '$lib/types/product'

    type ProductDisplay = Omit<
        ProductRow,
        'enlistedFor' | 'enlisted' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >

    // Mock Data
    const products: ProductDisplay[] = [
        {
            id: '01HZX8K0000000000000000001',
            name: 'Coolwave Classic',
            description: 'Household tub, original flavor',
            category: 'Multi-Serve Tubs',
            packaging: 'Tub',
            price: '185.00',
            currency: 'PHP',
            sizeValue: '800',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000002',
            name: 'FrostBite Berry',
            description: 'Limited summer release',
            category: 'Limited Edition',
            packaging: 'Cup',
            price: '49.00',
            currency: 'PHP',
            sizeValue: '150',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000003',
            name: 'ChocoCone Supreme',
            description: '',
            category: 'Single-Serve Novelties',
            packaging: 'Cone',
            price: '79.00',
            currency: 'PHP',
            sizeValue: '120',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000004',
            name: 'Family Pack Deluxe',
            description: 'Assorted flavors for the household',
            category: 'Combination Packs',
            packaging: 'Box',
            price: '320.00',
            currency: 'PHP',
            sizeValue: '12',
            sizeUnit: 'pcs',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000005',
            name: 'Mango Tango Pint',
            description: 'Tropical mango, single serve',
            category: 'Single-Serve Novelties',
            packaging: 'Pint',
            price: '95.00',
            currency: 'PHP',
            sizeValue: '400',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000006',
            name: 'Gold Medal Cup',
            description: '',
            category: 'Premium Novelties',
            packaging: 'Cup',
            price: '125.00',
            currency: 'PHP',
            sizeValue: '200',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000007',
            name: 'Gallon Feast',
            description: 'Value family refreezer',
            category: 'Specialty Tubs',
            packaging: 'Gallon',
            price: '640.00',
            currency: 'PHP',
            sizeValue: '3.8',
            sizeUnit: 'L',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000008',
            name: 'Stick Twist',
            description: '',
            category: 'Single-Serve Novelties',
            packaging: 'Stick',
            price: '35.00',
            currency: 'PHP',
            sizeValue: '60',
            sizeUnit: 'ml',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000009',
            name: 'Sunset Sorbet Combo',
            description: 'Citrus medley combination set',
            category: 'Combination Packs',
            packaging: 'Box',
            price: '285.00',
            currency: 'PHP',
            sizeValue: '10',
            sizeUnit: 'pcs',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000010',
            name: 'Midnight Mint Tub',
            description: 'Cooling mint specialty',
            category: 'Multi-Serve Tubs',
            packaging: 'Tub',
            price: '210.00',
            currency: 'PHP',
            sizeValue: '1',
            sizeUnit: 'L',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000011',
            name: 'Peanut Butter Box',
            description: '',
            category: 'Premium Novelties',
            packaging: 'Box',
            price: '150.00',
            currency: 'PHP',
            sizeValue: '6',
            sizeUnit: 'pcs',
            imageUrl: ''
        },
        {
            id: '01HZX8K0000000000000000012',
            name: 'Holiday Surprise Cup',
            description: 'Seasonal limited cup set',
            category: 'Limited Edition',
            packaging: 'Cup',
            price: '65.00',
            currency: 'PHP',
            sizeValue: '175',
            sizeUnit: 'ml',
            imageUrl: ''
        }
    ]

    function formatPrice(price: string) {
        return `₱${parseFloat(price).toFixed(2)}`
    }

    function sizeLabel(product: ProductDisplay) {
        const size = [product.sizeValue, product.sizeUnit].filter(Boolean).join(' ')
        return size || '—'
    }
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />

    <div class="min-h-screen p-6">
        <h1 class="mb-6 text-2xl font-bold">Products</h1>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
            {#each products as product (product.id)}
                <div class="card">
                    <div class="thumb">
                        {#if product.imageUrl}
                            <img class="thumb-img" src={product.imageUrl} alt={product.name} />
                        {:else}
                            <span class="thumb-placeholder"></span>
                        {/if}
                        <span class="badge">{product.category}</span>
                    </div>

                    <div class="body">
                        <div class="name">{product.name}</div>

                        {#if product.description}
                            <div class="desc">{product.description}</div>
                        {/if}

                        <div class="meta">
                            <span class="pack">{product.packaging}</span>
                            <span class="size">{sizeLabel(product)}</span>
                        </div>

                        <div class="price">{formatPrice(product.price)}</div>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .card {
        @apply overflow-hidden rounded-lg bg-white shadow-sm;
    }

    .thumb {
        @apply relative flex h-28 items-center justify-center bg-gray-100;
    }

    .thumb-img {
        @apply h-full w-full object-cover;
    }

    .thumb-placeholder {
        @apply h-10 w-10 rounded-full bg-gray-200;
    }

    .badge {
        @apply absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-gray-600;
    }

    .body {
        @apply flex flex-1 flex-col gap-1 p-3;
    }

    .name {
        @apply truncate font-semibold;
    }

    .desc {
        @apply line-clamp-2 text-sm text-gray-500;
    }

    .meta {
        @apply mt-1 flex items-center gap-2 text-xs text-gray-500;
    }

    .pack {
        @apply rounded bg-gray-100 px-1.5 py-0.5 font-medium;
    }

    .price {
        @apply mt-2 text-lg font-bold;
    }
</style>
