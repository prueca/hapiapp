<script lang="ts">
    import Item from './Item.svelte'
</script>

<div class="mb-16">
    <div class="content-wrapper">
        <div class="section-title">Freezers</div>
        <div class="list">
            <Item id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Item id="123456789" name="8cu Haier Curved Sliding Glass" />
            <Item id="123456789" name="8cu Haier Curved Sliding Glass" />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 text-lg;
    }
</style>
