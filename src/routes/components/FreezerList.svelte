<script lang="ts">
    import FreezerSearch from './FreezerSearch.svelte'
    import Freezers from './Freezers.svelte'
</script>

<div class="freezer-list">
    <div class="center">
        <div class="section-title">Freezers</div>
        <FreezerSearch />
        <Freezers />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .center {
        @apply mx-auto max-w-300 p-4;
    }

    .section-title {
        @apply mb-4 text-xl;
    }
</style>
