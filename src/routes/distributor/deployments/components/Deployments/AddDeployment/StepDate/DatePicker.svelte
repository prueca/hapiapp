<script lang="ts">
    import moment from 'moment'
    import deployment from '../deployment.svelte'
</script>

<div>
    <p class="label">Pick a schedule</p>
    <input
        class="input w-full"
        type="date"
        min={moment().format('YYYY-MM-DD')}
        bind:value={deployment.deploymentDate}
    />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .label {
        @apply mb-2 text-sm;
    }

    .input {
        @apply rounded-l;
    }
</style>
