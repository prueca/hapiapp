<script lang="ts">
    import Brand from './Brand.svelte'
    import LogoutButton from './LogoutButton.svelte'
</script>

<div class="navbar justify-between bg-base-100">
    <Brand />
    <LogoutButton />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
