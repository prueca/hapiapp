<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="cabcon">
    <div class="center">
        <div class="card bg-base-100">
            <div class="card-body">
                <h2 class="card-title">Lorem Store</h2>
                <p class="code">CABCONJAN2020</p>
                <div class="card-actions">
                    <button class="btn btn-lg">Capture</button>
                    <button class="btn btn-lg">Scan</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .cabcon {
        @apply w-full bg-slate-100;
    }

    .center {
        @apply mx-auto max-w-300 p-4;
    }

    .card {
        @apply w-full max-w-96 shadow-sm;
    }

    .code {
        @apply text-2xl font-bold;
    }

    .card-actions {
        @apply mt-4 gap-4;

        .btn {
            @apply w-24;
        }
    }
</style>
