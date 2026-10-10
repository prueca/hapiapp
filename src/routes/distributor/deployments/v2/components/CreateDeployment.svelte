<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers.svelte'
</script>

<div>
    <Stepper />
    <div class="content">
        <StepFreezers />
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content {
        @apply overflow-hidden rounded-b-lg bg-gray-50 p-2 md:p-4;
    }
</style>
