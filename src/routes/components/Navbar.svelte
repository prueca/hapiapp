<script lang="ts">
    import Brand from './Brand.svelte'
    import LogoutButton from './LogoutButton.svelte'
</script>

<div>
    <div class="content-wrapper">
        <div class="navbar justify-between bg-base-100">
            <Brand />
            <LogoutButton />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        @apply p-0;
    }
</style>
