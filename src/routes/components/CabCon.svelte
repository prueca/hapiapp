<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="cabcon">
    <div class="content-wrapper">
        <div class="card bg-base-100">
            <div class="card-body">
                <h2 class="card-title">Lorem Store</h2>
                <div class="code-container">
                    <div class="code">CABCONJAN2020</div>
                    <button class="copy-btn btn btn-circle btn-ghost btn-sm">
                        <Icon icon="si:copy-duotone" width="24" />
                    </button>
                </div>
                <div class="card-actions">
                    <button class="btn btn-lg">
                        <Icon icon="ph:camera-duotone" width="20" />
                        <span>Capture</span>
                    </button>
                    <button class="btn flex btn-lg">
                        <Icon icon="ph:scan-duotone" width="20" />
                        <span>Scan</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon {
        @apply w-full;
    }

    .card {
        @apply w-full rounded-xl bg-(--primary) text-white shadow-(--shadow-primary);
    }

    .code-container {
        @apply flex items-center gap-2;
        .code {
            @apply text-2xl font-bold;
        }
        .copy-btn {
            @apply text-white;

            &:hover {
                @apply bg-white/25;
            }
        }
    }

    .card-actions {
        @apply mt-4;

        .btn {
            @apply w-34 rounded-lg border-none bg-white/25 text-xl text-white;
        }
    }
</style>
