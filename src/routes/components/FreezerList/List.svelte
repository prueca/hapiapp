<script lang="ts">
    import Item from './Item.svelte'
    import Search from './Search.svelte'
</script>

<div class="mb-8">
    <Search />
    <div class="section-title">
        <span class="text-lg">Warehouse Freezers</span>
    </div>
    <div class="list">
        <Item
            id="123456789"
            name="8cu Haier Curved Sliding Glass"
            dateAssigned="01 Jan 2020"
            cabcon="2020JANCAB"
        />
        <Item
            id="123456789"
            name="8cu Haier Curved Sliding Glass"
            dateAssigned="01 Jan 2020"
            cabcon="2020JANCAB"
        />
        <Item
            id="123456789"
            name="8cu Haier Curved Sliding Glass"
            dateAssigned="01 Jan 2020"
            cabcon="2020JANCAB"
        />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 flex items-center justify-between;
    }
</style>
