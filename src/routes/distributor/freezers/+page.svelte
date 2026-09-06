<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import type { Freezer } from '$lib/types/freezer'
    import List from './components/List.svelte'
    import Toolbar from './components/Toolbar.svelte'
    import ItemSkeleton from './components/Item.skeleton.svelte'

    let { data }: { data: { freezers: Promise<Freezer[]> } } = $props()
</script>

<div class="content-wrapper">
    <TopBar />

    <div class="mb-21">
        <div class="px-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-lg">Freezers</span>
                <div class="flex items-center">
                    <button type="button" class="create-freezer btn btn-ghost btn-xs">
                        <span>&plus;</span>
                        <span>Create</span>
                    </button>
                </div>
            </div>

            <div class="overflow-hidden rounded-lg bg-white">
                <Toolbar />

                {#await data.freezers}
                    <div class="p-4">
                        {#each Array(6) as _}
                            <ItemSkeleton />
                        {/each}
                    </div>
                {:then freezers}
                    <List {freezers} />
                {/await}
            </div>
        </div>
    </div>

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .create-freezer {
        @apply flex items-center gap-2 rounded-md text-sm;
    }
</style>
