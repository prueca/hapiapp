<script lang="ts">
    import Icon from '@iconify/svelte'
    import camera from '../Camera.state.svelte'
</script>

<div class="controls">
    <div class="content-wrapper frosted">
        <div class="input-field">
            <label class="input">
                <Icon
                    class="text-white opacity-100"
                    icon="material-symbols-light:store-outline"
                    width="32"
                />
                <input
                    bind:value={camera.storeName}
                    type="text"
                    placeholder="What's your store name?"
                />
            </label>
        </div>
        <div class="btn-wrapper">
            <button class="btn btn-circle btn-lg" type="button" onclick={() => camera.capture()}>
                <div class="icon">
                    <Icon icon="solar:camera-bold-duotone" width="50" />
                </div>
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .controls {
        @apply absolute bottom-0 w-screen;
    }

    .content-wrapper {
        @apply flex h-full w-full items-center gap-4 p-4;
    }

    .btn-wrapper {
        @apply flex flex-col items-center justify-center gap-2;
    }

    .btn {
        @apply border-none bg-white/0 text-white/65;
    }

    .input-field {
        @apply grow;
    }

    .input {
        @apply w-full gap-0 rounded-lg border-none bg-white/25;

        input {
            @apply text-white placeholder-white;
        }
    }
</style>
