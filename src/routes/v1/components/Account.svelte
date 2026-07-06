<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div>
    <div class="store-name">Juan Dela Cruz Sari-sari Store</div>
    <div>
        <div class="data">
            <div class="lbl">Account Type</div>
            <div class="val">Hapistore</div>
        </div>
        <div class="data">
            <div class="lbl">Address</div>
            <div class="val">446 Stonewood Court, Standard Building, Madison, Wisconsin, 97040</div>
        </div>
        <div class="data">
            <div class="lbl">Phone No.</div>
            <div class="val">(191) 705-2898</div>
        </div>
        <div class="data">
            <div class="lbl">ISR Code</div>
            <div class="val">32240</div>
        </div>
        <div class="data">
            <div class="lbl">SAP Code</div>
            <div class="val">72617</div>
        </div>
        <div class="data">
            <div class="lbl">Company Code</div>
            <div class="val">02684</div>
        </div>
        <div class="data">
            <div class="lbl">Owner</div>
            <div class="val">Bud Akins</div>
        </div>
        <div class="data">
            <div class="lbl">Dealer</div>
            <div class="val">Federal Goods Corp.</div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .store-name {
        @apply mb-4 font-semibold;
    }

    .data {
        @apply sm:grid sm:grid-cols-2;

        .lbl {
            @apply mb-1 text-xs text-gray-400 sm:text-sm;
        }

        .val {
            @apply text-sm;
        }

        &:not(:last-child) {
            @apply mb-4;
        }
    }
</style>
