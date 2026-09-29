<!-- svelte-ignore a11y_label_has_associated_control -->

<script lang="ts">
    import Icon from '@iconify/svelte'
    import state from '../products.context.svelte'
</script>

<div class="product-form">
    <div class="heading">
        <h2 class="title">
            {#if state.isCreate}
                New Product
            {:else}
                Edit Product
            {/if}
        </h2>
        {#if !state.isCreate}
            <p class="subtitle">Updating “{state.editing?.name ?? ''}”</p>
        {/if}
    </div>

    <form onsubmit={(e) => e.preventDefault()}>
        <fieldset class="fieldset">
            <label class="label" for="name">Name</label>
            <input
                id="name"
                type="text"
                class="input w-full"
                placeholder="e.g. Mango Tub"
                bind:value={state.newName}
            />
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="description">Description</label>
            <textarea
                id="description"
                class="input w-full"
                placeholder="Short description"
                bind:value={state.newDescription}
            ></textarea>
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="category">Category</label>
            <select class="select w-full" bind:value={state.newCategory}>
                <option value="">Select a category</option>
                {#each state.categoryOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="packaging">Packaging</label>
            <select class="select w-full" bind:value={state.newPackaging}>
                <option value="">Select packaging</option>
                {#each state.packagingOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="price">Price</label>
            <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                class="input w-full"
                placeholder="0.00"
                bind:value={state.newPrice}
            />
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="currency">Currency</label>
            <input
                id="currency"
                type="text"
                class="input w-full"
                value={state.newCurrency}
                readonly
                disabled
            />
            <p class="hint">Currency is fixed.</p>
        </fieldset>

        <fieldset class="fieldset grid-cols-2">
            <div class="col-span-2 flex items-center justify-between">
                <label class="label">Size</label>
            </div>
            <div class="field">
                <label class="label" for="size-value">Value</label>
                <input
                    id="size-value"
                    type="text"
                    class="input w-full"
                    placeholder="e.g. 500"
                    bind:value={state.newSizeValue}
                />
            </div>
            <div class="field">
                <label class="label" for="size-unit">Unit</label>
                <input
                    id="size-unit"
                    type="text"
                    class="input w-full"
                    placeholder="e.g. ml"
                    bind:value={state.newSizeUnit}
                />
            </div>
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="image-url">Image URL</label>
            <input
                id="image-url"
                type="text"
                class="input w-full"
                placeholder="https://..."
                bind:value={state.newImageUrl}
            />
        </fieldset>

        <fieldset class="fieldset">
            <label class="label" for="enlisted-for">Enlisted For</label>
            <select class="select w-full" bind:value={state.newEnlistedFor}>
                <option value="">Select</option>
                {#each state.enlistedForFormOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>
        </fieldset>

        <fieldset class="fieldset">
            <label class="switch-label label">
                Enlisted
                <input type="checkbox" class="switch" bind:checked={state.newEnlisted} />
            </label>
        </fieldset>

        {#if state.submitError}
            <p class="error">{state.submitError}</p>
        {/if}

        <div class="modal-action">
            <button
                type="button"
                class="close-btn btn btn-ghost"
                onclick={() => state.cancelForm()}
            >
                Cancel
            </button>
            <button
                type="submit"
                class="btn"
                disabled={state.submitting || !state.newName.trim() || state.newPrice === ''}
                onclick={() => state.submit()}
            >
                {#if state.submitting}
                    {state.isCreate ? 'Creating...' : 'Saving...'}
                {:else}
                    {#if state.isCreate}
                        <Icon icon="bi:plus-lg" width="16" />
                    {/if}
                    {state.isCreate ? 'Create' : 'Update'}
                {/if}
            </button>
        </div>
    </form>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .product-form {
        @apply mx-auto max-w-md;
    }

    .heading {
        @apply mb-4;
    }

    .title {
        @apply text-lg font-bold;
    }

    .subtitle {
        @apply text-xs text-gray-500;
    }

    .fieldset {
        @apply not-last:mb-4;

        &.grid-cols-2 {
            @apply grid grid-cols-2 gap-2;
        }

        .input {
            @apply rounded-lg;
        }
    }

    .switch-label {
        @apply flex items-center gap-2;
    }

    .hint {
        @apply mt-1 text-xs text-gray-500;
    }

    .modal-action {
        @apply mt-6 flex justify-end gap-2;
    }

    .error {
        @apply mb-4 rounded-lg bg-red-50 p-2 text-sm text-red-600;
    }
</style>
