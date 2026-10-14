<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'
    import Brand from './Brand.svelte'
    // import LogoutButton from './LogoutButton.svelte'
</script>

<div class="navbar">
    <Brand />
    <!-- <LogoutButton /> -->
    <div class="flex items-center gap-6">
        <a href="#" class="btn-link">
            <Icon icon="solar:bell-outline" width="24" />
        </a>
        <a href="#" class="btn-link">
            <Icon icon="heroicons:user-circle" width="24" />
        </a>
        <a href="#" class="btn-link">
            <Icon icon="boxicons:menu" width="24" />
        </a>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .navbar {
        @apply mb-4 justify-between bg-(--c7) px-4;
    }

    .btn-link {
        @apply no-underline;
    }
</style>
