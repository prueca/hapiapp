<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import type { ProductRow, ProductMeta } from '$lib/types/product'
    import List from './components/List.svelte'
    import Toolbar from './components/Toolbar.svelte'
    import Create from './components/Create.svelte'
    import ConfirmDelete from './components/ConfirmDelete.svelte'
    import state from './products.context.svelte'

    let { data }: { data: { data: ProductRow[]; meta: ProductMeta } } = $props()
</script>

<div class="content-wrapper">
    <TopBar />

    <div class="mb-21">
        <div class="px-4">
            <div class="tabs-border tabs flex w-full" role="tablist">
                <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                <label
                    id="tab-product-listing"
                    class="tab flex-1"
                    role="tab"
                    aria-selected={state.activeTab === 'listing'}
                >
                    <input
                        type="radio"
                        name="product-tabs"
                        bind:group={state.activeTab}
                        value="listing"
                    />
                    <span class="px-1 md:px-4">Products</span>
                </label>
                <div
                    class="tab-content p-2 md:px-0"
                    role="tabpanel"
                    aria-labelledby="tab-product-listing"
                >
                    {#if state.activeTab === 'listing'}
                        <div class="overflow-hidden rounded-lg bg-white">
                            <Toolbar />

                            <List rows={data.data} meta={data.meta} />

                            <ConfirmDelete />
                        </div>
                    {/if}
                </div>

                <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                <label
                    id="tab-product-create"
                    class="tab flex-1"
                    role="tab"
                    aria-selected={state.activeTab === 'create'}
                >
                    <input
                        type="radio"
                        name="product-tabs"
                        bind:group={state.activeTab}
                        value="create"
                    />
                    <span class="px-1 md:px-4">New Product</span>
                </label>
                <div
                    class="tab-content p-2 md:px-0"
                    role="tabpanel"
                    aria-labelledby="tab-product-create"
                >
                    {#if state.activeTab === 'create'}
                        <div class="overflow-hidden rounded-lg bg-white p-4">
                            <Create />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
