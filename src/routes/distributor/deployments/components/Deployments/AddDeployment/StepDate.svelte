<script lang="ts">
    import DatePicker from './StepDate/DatePicker.svelte'
    import deployment from '../../../deployment.svelte'

    const back = () => {
        deployment.setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div class="flex flex-col gap-4 bg-(--c6) p-4 md:gap-4">
    <div class="section bg-base-100">
        <DatePicker />
    </div>
    <div class="section bg-base-100">
        <div class="label">Deployment Date</div>
        <div class="deployment-date">Mon, Oct 12 2026</div>
        <div class="flex flex-row-reverse gap-2 text-right">
            <button type="button" class="btn btn-ghost btn-sm">Submit</button>
            <button type="button" class="btn btn-ghost btn-sm" onclick={back}>Back</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded p-4 shadow;
    }

    .label {
        @apply mb-2 text-sm;
    }

    .deployment-date {
        @apply mb-4 text-xl font-medium text-(--c1) md:text-xl;
    }

    .btn {
        @apply no-underline;
    }
</style>
