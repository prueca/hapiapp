<div class="filters">
    <button class="blue btn">All</button>
    <button class="green btn">Status</button>
    <button class="red btn">Status</button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .filters {
        @apply grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3;
    }
    .btn {
        @apply grow rounded-lg border-none bg-transparent text-slate-400;

        &.green {
            @apply bg-(--green) text-white;
        }
        &.blue {
            @apply bg-(--blue) text-white;
        }
        &.red {
            @apply bg-(--red) text-white;
        }
    }
</style>
