<script lang="ts">
    import List from './components/List.svelte'
    import state from './products.state.svelte'

    state.load()
</script>

<div class="content-wrapper">
    <List />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
