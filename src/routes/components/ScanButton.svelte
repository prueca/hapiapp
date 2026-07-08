<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="component">
    <div class="content-wrapper">
        <div class="fab absolute">
          <button class="btn btn-lg btn-circle btn-primary">
            <div class="icon">
                <Icon icon="solar:camera-outline" width="32" />
            </div>
          </button>
        </div>
    </div>
</div>


<style lang="postcss">
    @reference 'tailwindcss';

    .component {
        @apply fixed bottom-20 right-0 left-0;
    }

    .content-wrapper {
        @apply relative;
    }

    .fab {
        @apply absolute;
    }

    .btn {
        @apply size-14 block text-center items-center justify-center bg-(--c1) border-none text-white shadow-(--c1-shadow);

        .icon {
            @apply flex items-center justify-center mb-1;
        }
    }
</style>