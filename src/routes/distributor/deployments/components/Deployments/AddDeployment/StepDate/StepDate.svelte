<script lang="ts">
    import moment from 'moment'
    import DatePicker from './DatePicker.svelte'
    import deployment from '../../../../deployment.svelte'

    const back = () => {
        deployment.setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const date = $derived(moment(deployment.deploymentDate).format('ddd, MMM DD YYYY'))
    const isComplete = $derived(
        deployment.freezers.length && deployment.destinationAccount && deployment.deploymentDate
    )
</script>

<div class="flex flex-col gap-4 bg-(--c6) p-4 md:gap-4">
    <div class="section bg-base-100">
        <DatePicker />
    </div>
    <div class="section bg-base-100">
        <div class="label">Deployment date</div>
        {#if !deployment.deploymentDate}
            <div class="text-gray-400 italic">Select deployment schedule</div>
        {:else}
            <div class="deployment-date">{date}</div>
        {/if}
        <div class="flex flex-row-reverse gap-2 text-right">
            {#if isComplete}
                <button type="button" class="btn btn-ghost btn-sm">Submit</button>
            {/if}
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
        @apply mb-4 text-xl font-medium text-(--c8) md:text-xl;
    }

    .btn {
        @apply no-underline;
    }
</style>
