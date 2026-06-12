<script lang="ts">
    import Icon from '@iconify/svelte'
    import CabCon from './CabCon.svelte'
</script>

<div class="bg-base-200">
    <div class="content-wrapper">
        <div class="tabs-lift tabs tabs-lg">
            <!-- home -->
            <label class="tab">
                <input type="radio" name="tabs" checked />
                <Icon icon="solar:home-2-outline" width="22" />
                <span class="ml-1">Home</span>
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <CabCon />
            </div>

            <!-- account -->
            <label class="tab">
                <input type="radio" name="tabs" />
                <Icon icon="solar:user-linear" width="22" />
                <span class="ml-1">Account</span>
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quos.
            </div>
        </div>
    </div>
</div>
