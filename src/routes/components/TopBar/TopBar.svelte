<script lang="ts">
    import Brand from './Brand.svelte'
    import LogoutButton from './LogoutButton.svelte'
</script>

<div class="navbar justify-between">
    <Brand />
    <LogoutButton />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
