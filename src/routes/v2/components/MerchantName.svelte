<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="content-wrapper bg-gray-100">
    <div class="merchant-name">
        <Icon icon="material-symbols:store-outline-rounded" width="22" />
        <div>Lorem Ipsum Store</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .merchant-name {
        @apply flex items-center gap-2;
    }
</style>
