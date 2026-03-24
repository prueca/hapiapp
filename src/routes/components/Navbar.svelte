<script lang="ts">
    import Brand from './Brand.svelte'
    import Menu from './Menu.svelte'
</script>

<div class="nav">
    <div class="center">
        <div class="navbar justify-between bg-base-100">
            <Brand />
            <Menu />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
    .center {
        @apply mx-auto max-w-300;
    }
</style>
