<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../products.state.svelte'
</script>

<div class="content-wrapper">
    <div class="join flex w-full">
        <div class="join-item grow">
            <label class="input join-item w-full">
                <input type="text" placeholder="Search products..." bind:value={state.query} />
            </label>
        </div>
        <button class="btn join-item" title="Search">
            <Icon icon="icon-park-outline:search" width="18" />
        </button>
    </div>

    <div class="row">
        <select class="select flex-1" bind:value={state.category}>
            {#each state.categories as c}
                <option value={c}>{c}</option>
            {/each}
        </select>

        <select class="select flex-1" bind:value={state.sort}>
            {#each state.sortOptions as opt}
                <option value={opt.value}>{opt.label}</option>
            {/each}
        </select>

        {#if state.hasFilters}
            <button class="btn btn-ghost btn-sm" onclick={state.resetFilters}>Clear</button>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        @apply mb-6 flex flex-col gap-3 p-0;
    }

    .row {
        @apply flex items-center gap-3;
    }
</style>
