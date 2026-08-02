<script lang="ts">
    import camera from '../Camera.state.svelte'
    import Icon from '@iconify/svelte'
</script>

<div class="content-wrapper">
    <div class="center">
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
