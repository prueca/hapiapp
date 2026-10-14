<script lang="ts">
    import Icon from '@iconify/svelte'
    import moment from 'moment'
</script>

<div class="mb-2 p-4 md:px-0">
    <div class="mb-2 flex items-center justify-between">
        <span>Deployments Overview</span>
        <span class="text-xs">{moment().format('ddd, MMM DD YYYY')}</span>
    </div>
    <div class="stats w-full grid-cols-2 bg-(--c7)">
        <div class="stat">
            <div class="stat-figure">
                <Icon icon="andrsrxn:box-move" width="36" />
            </div>
            <div class="stat-title">Deployment</div>
            <div class="stat-value text-(--c1)">20</div>
            <div class="stat-desc">4 Overdue</div>
        </div>
        <div class="stat">
            <div class="stat-figure">
                <Icon icon="andrsrxn:box-return" width="36" />
            </div>
            <div class="stat-title">Pullout</div>
            <div class="stat-value text-(--c1)">5</div>
            <div class="stat-desc">1 Account</div>
        </div>
    </div>
</div>
