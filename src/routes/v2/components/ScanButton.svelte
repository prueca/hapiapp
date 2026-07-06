<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="content-wrapper">
    <div class="btn-wrapper">
        <button class="btn btn-circle">
            <div class="icon">
                <Icon icon="solar:camera-outline" width="32" />
            </div>
            <div class="text">Capture</div>
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        @apply p-0;
    }

    .btn-wrapper {
        @apply w-full flex justify-center;
        background: linear-gradient(0deg, var(--c3) 50%, var(--c2) 50%);
    }

    .btn {
        @apply size-24 block text-center items-center justify-center bg-(--c1) border-none text-white shadow-(--c1-shadow);

        .icon {
            @apply flex items-center justify-center mb-1;
        }
        
        .text {
            @apply text-xs;
        }
    }
</style>
