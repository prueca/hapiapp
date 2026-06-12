<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div>
    <div class="cabcon-code">CABCONJAN2020</div>
    <div class="btn-group">
        <button class="btn btn-link">
            <div class="btn-content">
                <Icon class="block" icon="solar:card-broken" width="32" />
                <div>Cabcon</div>
            </div>
        </button>
        <button class="btn btn-link">
            <div class="btn-content">
                <Icon icon="solar:camera-broken" width="32" />
                <div>Capture</div>
            </div>
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon-code {
        @apply mb-6 text-xl font-semibold;
    }

    .btn-group {
        @apply flex w-full items-center justify-around;
    }

    .btn {
        @apply no-underline;
    }

    .btn-content {
        @apply flex flex-col items-center justify-center;
    }
</style>
