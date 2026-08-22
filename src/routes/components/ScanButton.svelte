<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="scan-btn">
    <div class="fab absolute">
        <button class="btn btn-circle btn-lg btn-primary">
            <div class="icon">
                <Icon icon="solar:camera-outline" width="32" />
            </div>
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .scan-btn {
        @apply fixed relative right-0 bottom-20 left-0;
    }

    .fab {
        @apply absolute;
    }

    .btn {
        @apply block size-14 items-center justify-center border-none bg-(--c1) text-center text-white shadow-(--c1-shadow);

        .icon {
            @apply mb-1 flex items-center justify-center;
        }
    }
</style>
