<script lang="ts">
    import ListItem from './ListItem.svelte'
    import Search from './Search.svelte'
</script>

<div>
    <Search />
    <div class="flex flex-col gap-4">
        <ListItem />
        <ListItem />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
