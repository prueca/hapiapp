<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div>
    <div class="cabcon-code">CABCONJAN2020</div>
    <div class="btn-group">
        <button class="btn">
            <div class="btn-content">
                <Icon class="block" icon="solar:card-outline" width="22" />
                <div class="text-sm">Cabcon</div>
            </div>
        </button>
        <button class="btn">
            <div class="btn-content">
                <Icon icon="solar:camera-outline" width="22" />
                <div class="text-sm">Capture</div>
            </div>
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon-code {
        @apply mb-6 font-semibold;
    }

    .btn-group {
        @apply flex w-full items-center justify-around gap-4;
    }

    .btn {
        @apply rounded-lg border-none bg-(--c1) text-white no-underline shadow-(--gradient-shadow);
    }

    .btn-content {
        @apply flex items-center justify-center gap-2;
    }
</style>
