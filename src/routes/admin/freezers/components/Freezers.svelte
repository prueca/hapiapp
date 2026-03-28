<script lang="ts">
    import FreezerSearch from './FreezerSearch.svelte'
    import FreezerList from './FreezerList.svelte'
</script>

<div class="freezer-list">
    <div class="content-wrapper">
        <div class="section-title">Freezers</div>
        <FreezerSearch />
        <FreezerList />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 text-xl;
    }
</style>
