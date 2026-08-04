<script lang="ts">
    import camera from '../Camera.state.svelte'
    import Icon from '@iconify/svelte'
</script>

<div class="content-wrapper">
    <div class="center">
        <div class="error-message" class:hidden={camera.error === ''}>
            <div class="flex items-start gap-4">
                <Icon class="opacity-100" icon="typcn:warning-outline" width="22" />
                <span>{camera.error}</span>
            </div>
        </div>
        <label class="input">
            <input
                bind:value={camera.storeName}
                type="text"
                placeholder="What's your store name?"
            />
        </label>
        <div class="btn-wrapper">
            <button class="capture-btn btn" onclick={() => camera.capture()}>
                <Icon class="opacity-100" icon="material-symbols:camera-outline" width="22" />
                <span>Capture</span>
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .center {
        @apply my-8 text-center;
    }

    .error-message {
        @apply mx-auto mb-6 max-w-64 rounded-lg bg-[#fefce8] px-4 py-2 text-left text-sm text-[#854d0e];
    }

    .input {
        @apply mb-6 w-full max-w-64 rounded-lg lg:max-w-90;

        input {
            @apply text-center;
        }
    }

    .btn-wrapper {
        @apply w-full;
    }

    .capture-btn {
        @apply w-full max-w-64 rounded-lg border-none bg-(--c1) text-white lg:max-w-90;
    }
</style>
