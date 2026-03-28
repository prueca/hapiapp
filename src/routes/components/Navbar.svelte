<script lang="ts">
    import Brand from './Brand.svelte'
    import Menu from './Menu.svelte'
</script>

<div class="nav">
    <div class="content-wrapper">
        <div class="navbar justify-between bg-base-100">
            <Brand />
            <Menu />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
    .content-wrapper {
        @apply border-b border-b-gray-200 p-0;
    }
</style>
