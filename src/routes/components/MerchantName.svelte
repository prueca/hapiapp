<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="content-wrapper">
    <div class="merchant-name">
        <Icon icon="material-symbols:store-outline-rounded" width="22" />
        <div>Lorem Ipsum Store</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        /* https://grabient.com/IwOgDBA0C0oOxgMyRAFlQNkmSAmEGAnMqGKjmhqisGLimIQBzYpOFYhyqFA?angle=225 */

        background: linear-gradient(
            225deg,
            #ff6f70 0%,
            #ffa091 20%,
            #ffc7b1 40%,
            #ffe4d0 60%,
            #fff6ee 80%,
            #fffcff 100%
        );

        mask-image: linear-gradient(to bottom, black 0%, black 25%, transparent 100%);

        @apply pb-16;
    }

    .merchant-name {
        @apply flex items-center gap-2;
    }
</style>
