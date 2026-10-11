<script lang="ts">
    import DatePicker from './DatePicker.svelte'
</script>

<div class="flex flex-col gap-2 md:gap-4">
    <div class="section bg-base-100">
        <DatePicker />
    </div>
    <div class="section bg-base-100">
        <div class="mb-4">
            <div class="mb-1 text-lg">Deployment Date</div>
            <div class="text-xs text-gray-400">Selected date of deployment</div>
        </div>
        <div class="mb-4 text-2xl font-medium text-(--c2)">Mon, Oct 12 2026</div>
        <div class="flex flex-row-reverse gap-2 text-right">
            <button type="button" class="btn btn-ghost btn-sm">Create</button>
            <button type="button" class="btn btn-ghost btn-sm">Back</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded p-4 shadow;
    }

    .btn {
        @apply no-underline;
    }
</style>
