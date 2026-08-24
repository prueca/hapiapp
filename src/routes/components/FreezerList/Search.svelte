<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="join mt-4 mb-6 flex w-full">
    <div class="join-item grow">
        <label class="validator input join-item w-full">
            <input type="text" placeholder="Search..." required />
        </label>
        <div class="validator-hint hidden">Enter search query</div>
    </div>
    <button class="btn join-item">
        <Icon icon="icon-park-outline:search" width="18" />
    </button>
    <button class="btn join-item">
        <Icon icon="icon-park-outline:filter" width="18" />
    </button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>
