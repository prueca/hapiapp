<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'
    import create from '../create.svelte'
</script>

<div class="stepper">
    <!-- Step 1: Select Freezer -->
    <div class="step active">
        <div class="step-icon">
            <Icon icon="reicon:fridge-filled" width="24" />
        </div>
        <span class="step-label">Freezers</span>
    </div>

    <!-- Connector Line -->
    <div class="connector">
        {#if create.currentStep >= 2}
            <div class="active"></div>
        {/if}
    </div>

    <!-- Step 2: Select Account -->
    <div class="step" class:active={create.currentStep >= 2}>
        <div class="step-icon">
            <Icon icon="bi:passport-fill" width="24" />
        </div>
        <span class="step-label">Account</span>
    </div>

    <!-- Connector Line -->
    <div class="connector">
        {#if create.currentStep === 3}
            <div class="active"></div>
        {/if}
    </div>

    <!-- Step 3: Select Date -->
    <div class="step" class:active={create.currentStep === 3}>
        <div class="step-icon">
            <Icon icon="clarity:calendar-solid-badged" width="24" />
        </div>
        <span class="step-label">Date</span>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .stepper {
        --active-color: var(--c2);

        @apply mx-auto mt-1 flex items-center justify-between px-2 py-4 md:px-4;
    }

    .step {
        @apply flex h-auto flex-1 flex-col items-center text-gray-300;

        &.active {
            @apply text-(--active-color);
        }

        .step-icon {
            @apply mb-2;
        }

        .step-label {
            @apply text-sm font-medium;
        }
    }

    .connector {
        @apply mx-2 hidden h-0.5 flex-1 bg-gray-300 md:block;

        .active {
            @apply h-full bg-(--active-color);
        }
    }
</style>
