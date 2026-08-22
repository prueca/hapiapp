<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="welcome-banner">
    <div class="mb-8 flex items-start justify-between">
        <div>
            <div class="mb-1 text-xl">Good day, Peter</div>
            <div class="text-sm">Logged in as Admin Distributor</div>
        </div>
        <Icon icon="streamline-flex:smiley-blessed-solid" width="42" />
    </div>
    <div>
        <div class="mb-1 text-sm">OrbitLume Industries</div>
        <div class="text-sm">145 Oakwood Lane, Springfield, IL 62704</div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .welcome-banner {
        @apply mx-4 mt-2 mb-4 rounded-lg bg-(--c1) p-4 text-white;
        background: linear-gradient(135deg, #e16660, #f5b8b4);
    }
</style>
