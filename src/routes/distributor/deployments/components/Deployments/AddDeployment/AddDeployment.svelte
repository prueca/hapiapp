<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers'
    import StepAccount from './StepAccount'
    import StepDate from './StepDate'
    import deployment from '../../../deployment.svelte'
</script>

<div class="flex flex-col">
    <Stepper />
    <div class="content">
        {#if deployment.currentStep === 3}
            <StepDate />
        {:else if deployment.currentStep === 2}
            <StepAccount />
        {:else}
            <StepFreezers />
        {/if}
    </div>
</div>
