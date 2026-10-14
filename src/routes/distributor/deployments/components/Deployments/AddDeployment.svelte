<script lang="ts">
    import Stepper from './AddDeployment/Stepper.svelte'
    import StepFreezers from './AddDeployment/StepFreezers.svelte'
    import StepAccount from './AddDeployment/StepAccount.svelte'
    import StepDate from './AddDeployment/StepDate.svelte'
    import deployment from '../../deployment.svelte'
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
