<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="dock">
    <button class="dock-active">
        <Icon icon="solar:home-2-outline" width="24" />
        <span class="dock-label">Home</span>
    </button>

    <button>
        <Icon icon="hugeicons:note" width="24" />
        <span class="dock-label">Products</span>
    </button>

    <button>
        <Icon icon="fa7-solid:ellipsis" width="24" />
        <span class="dock-label">Others</span>
    </button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .dock {
        @apply left-1/2 max-w-150 -translate-x-1/2 bg-(--c1) text-white;
    }
</style>
