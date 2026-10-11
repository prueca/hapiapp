<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers.svelte'
    import StepAccount from './StepAccount.svelte'
    import StepDate from './StepDate.svelte'
    import create from '../create.svelte'
</script>

<div>
    <Stepper />
    <div class="content">
        {#if create.currentStep === 3}
            <StepDate />
        {:else if create.currentStep === 2}
            <StepAccount />
        {:else}
            <StepFreezers />
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content {
        @apply overflow-hidden rounded-b-lg bg-gray-50 p-2 md:p-4;
    }
</style>
