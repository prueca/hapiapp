<!-- svelte-ignore  a11y_missing_attribute -->
<!-- svelte-ignore  a11y_click_events_have_key_events -->
<!-- svelte-ignore  a11y_no_static_element_interactions -->

<script lang="ts">
    import _ from 'lodash'
    import { getDisplayText } from '$lib/config/account.types'

    let { onclick, item } = $props()
</script>

<li>
    <a onmousedown={(e) => e.preventDefault()} {onclick}>
        <div class="account-option">
            <div class="flex items-start justify-between">
                <div class="mb-2 font-medium">
                    {item.name}
                </div>
            </div>
            <div class="mb-1 text-xs text-gray-400">
                <span>{getDisplayText(item.type)}</span>
                <span class="mx-1">•</span>
                <span>{item.address}</span>
            </div>
        </div>
    </a>
</li>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-option {
        @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
    }

    li > a {
        @apply rounded-lg;

        &:active {
            @apply bg-(--c4) text-(--font-color);
        }
    }
</style>
