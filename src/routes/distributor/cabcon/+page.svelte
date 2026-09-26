<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import type { CabconRow, CabconMeta } from '$lib/types/cabcon'
    import List from './components/List.svelte'
    import Toolbar from './components/Toolbar.svelte'
    import Create from './components/Create.svelte'
    import ConfirmDelete from './components/ConfirmDelete.svelte'
    import state from './cabcon.context.svelte'

    let { data }: { data: { data: CabconRow[]; meta: CabconMeta } } = $props()
</script>

<div class="content-wrapper">
    <TopBar />

    <div class="mb-21">
        <div class="px-4">
            <div class="tabs-border tabs flex w-full" role="tablist">
                <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                <label
                    id="tab-cabcon-listing"
                    class="tab flex-1"
                    role="tab"
                    aria-selected={state.activeTab === 'listing'}
                >
                    <input
                        type="radio"
                        name="cabcon-tabs"
                        bind:group={state.activeTab}
                        value="listing"
                    />
                    <span class="px-1 md:px-4">Code of the Month</span>
                </label>
                <div
                    class="tab-content p-2 md:px-0"
                    role="tabpanel"
                    aria-labelledby="tab-cabcon-listing"
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
                    id="tab-cabcon-create"
                    class="tab flex-1"
                    role="tab"
                    aria-selected={state.activeTab === 'create'}
                >
                    <input
                        type="radio"
                        name="cabcon-tabs"
                        bind:group={state.activeTab}
                        value="create"
                    />
                    <span class="px-1 md:px-4">New Code of the Month</span>
                </label>
                <div
                    class="tab-content p-2 md:px-0"
                    role="tabpanel"
                    aria-labelledby="tab-cabcon-create"
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
