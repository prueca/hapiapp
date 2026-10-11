<script lang="ts">
</script>

<fieldset class="fieldset">
    <div class="mb-2">
        <legend class="fieldset-legend">Pick a Date</legend>
        <p class="label">Select a date for deployment</p>
    </div>
    <input class="input w-full" type="date" />
</fieldset>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply mb-4;
    }

    .fieldset-legend {
        @apply pt-0 text-lg font-normal text-(--font-color);
    }

    .input {
        @apply rounded-l;
    }
</style>
