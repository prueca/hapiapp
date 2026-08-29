<!--
  Toolbar: the search + filter bar for the freezers list.

  Search input binds to `state.query`; the filter button opens the Filters modal
  via `state.openFilters = true`. Depends only on the state singleton (not on the
  fetched rows), so it is safe to render during the initial load. daisyUI `join`
  groups the input and buttons into a single segmented control.
-->
<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../freezers.context.svelte'
    import Filters from './Filters.svelte'
</script>

<div class="content-wrapper">
    <div class="join flex w-full">
        <div class="join-item grow">
            <label class="input join-item w-full">
                <input type="text" placeholder="Search freezers..." bind:value={state.query} />
            </label>
        </div>
        <button class="btn join-item" title="Search">
            <Icon icon="icon-park-outline:search" width="18" />
        </button>
        <button class="btn join-item" title="Filters" onclick={() => (state.openFilters = true)}>
            <Icon icon="icon-park-outline:filter" width="18" />
        </button>
    </div>
</div>

<Filters />

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        @apply flex flex-col gap-3 p-0;
    }
</style>
