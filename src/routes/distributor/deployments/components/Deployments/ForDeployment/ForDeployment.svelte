<script lang="ts">
    import ListItem from './ListItem.svelte'
    import Search from './Search.svelte'
</script>

<div class="flex flex-col">
    <Search />
    <div class="flex flex-col gap-4 bg-(--c6) p-4">
        <ListItem />
        <ListItem />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
