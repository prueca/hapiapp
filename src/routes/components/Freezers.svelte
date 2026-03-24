<script lang="ts">
    import Freezer from './Freezer.svelte'
</script>

<div class="freezers">
    <div class="center">
        <div class="list">
            <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
        </div>
        <button class="load-btn btn btn-ghost btn-lg">Load More</button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .center {
        @apply mx-auto max-w-300;
    }

    .list {
        @apply md:mb-8 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3;
    }

    .load-btn {
        @apply relative mx-auto block w-full max-w-xs;
    }
</style>
