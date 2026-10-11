<script lang="ts">
    import _ from 'lodash'
    import { getDisplayText } from '$lib/config/account.types'

    let account = {
        name: 'Wancavino',
        type: 'dealer',
        address: 'Montalban, Rizal'
    }
</script>

<div class="mb-4 rounded-lg bg-gray-50 p-4">
    <div class="flex items-start justify-between">
        <div class="mb-1 font-medium">
            {account.name}
        </div>
    </div>
    <div class="mb-1 text-xs text-gray-400">
        <span>{getDisplayText(account.type)}</span>
        <span class="mx-1">•</span>
        <span>{account.address}</span>
    </div>
</div>
