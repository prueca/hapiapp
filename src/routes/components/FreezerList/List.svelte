<script lang="ts">
    import Item from './Item.svelte'
</script>

<div class="mb-16">
    <div class="content-wrapper">
        <div class="section-title">Freezers</div>
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
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section-title {
        @apply mb-4 text-lg;
    }
</style>
