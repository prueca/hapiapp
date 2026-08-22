<script lang="ts">
    import Icon from '@iconify/svelte'
    import OtherMenu from './OtherMenu.svelte'

    let isOpen = $state(false)

    function toggle() {
        isOpen = !isOpen
    }
</script>

<div class="dock">
    <button class="dock-active">
        <Icon icon="lineicons:dashboard-square-1" width="24" />
        <span class="dock-label">Dashboard</span>
    </button>

    <button>
        <Icon icon="solar:notes-outline" width="24" />
        <span class="dock-label">Products</span>
    </button>

    <button onclick={toggle}>
        <Icon icon="solar:menu-dots-square-outline" width="24" />
        <span class="dock-label">More</span>
    </button>
</div>

{#if isOpen}
    <OtherMenu />
{/if}

<style lang="postcss">
    @reference 'tailwindcss';

    .dock {
        @apply left-1/2 max-w-150 -translate-x-1/2 bg-(--c1) text-white;
    }
</style>
