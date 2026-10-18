<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers'
    import StepAccount from './StepAccount'
    import StepDate from './StepDate'
    import MessageLoading from './MessageLoading.svelte'
    import MessageSuccess from './MessageSuccess.svelte'
    import MessageError from './MessageError.svelte'
    import deployment from '../../../deployment.svelte'
</script>

<MessageLoading />
<MessageSuccess />
<MessageError />

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
