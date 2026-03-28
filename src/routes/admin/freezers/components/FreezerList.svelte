<script lang="ts">
    import Freezer from './Freezer.svelte'
</script>

<div class="freezers">
    <div class="list">
        <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
        <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
        <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
        <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
        <Freezer id="123456789" name="8cu Haier Curved Sliding Glass" />
    </div>
    <button class="load-btn btn btn-ghost btn-lg">Load More</button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .load-btn {
        @apply relative mx-auto block w-full max-w-xs rounded-xl;
    }
</style>
