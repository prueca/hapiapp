<!--
  Distributor freezers page.

  Composes the page chrome that is INDEPENDENT of the fetched data — TopBar,
  the "Freezers" heading, the Toolbar card, and Dock — OUTSIDE the {#await} block
  so it stays visible while data loads. Only the list body is gated on
  Promise.all([data.freezers, data.codeMonths]):
    - pending: 6x ItemSkeleton in the list region (replaces the old bare
      "Loading…" text so chrome + placeholders stay put).
    - then:    <List {freezers} {codeMonths} />.
-->
<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import List from './components/List.svelte'
    import Toolbar from './components/Toolbar.svelte'
    import ItemSkeleton from './components/Item.skeleton.svelte'

    let { data } = $props()
</script>

<div class="content-wrapper">
    <TopBar />

    <div class="mb-21 px-4">
        <div class="mb-2">Freezers</div>

        <div class="mb-4 rounded-lg bg-white p-4">
            <Toolbar />
        </div>

        {#await Promise.all([data.freezers, data.codeMonths])}
            <div class="list mt-3 flex flex-col gap-3">
                {#each Array(6) as _}
                    <ItemSkeleton />
                {/each}
            </div>
        {:then [freezers, codeMonths]}
            <List {freezers} {codeMonths} />
        {/await}
    </div>

    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
