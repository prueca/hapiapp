<script lang="ts">
    import Icon from '@iconify/svelte'
    let menuOpen = $state<boolean>(false);
      interface Account {
        merchantName: string
        accountType: string
        address: string
        phoneNo: string
        isrCode: string
        sapCode: string
        companyCode: string
        owner: string
        dealer: string
     }

    const accountItem: Account = {
        merchantName: 'Lorem Ipsum Store',
        accountType: 'Hapistore',
        address: '446 Stonewood Court, Standard Building, Madison, Wisconsin, 97040',
        phoneNo: '(191) 705-2898',
        isrCode: '32240',
        sapCode: '72617',
        companyCode: '02684',
        owner: 'Bud Akins',
        dealer: 'Federal Goods Corp.'
    }

    const menuItems = [
        { label: 'Request for Details Update', href: '/v3/account/update' },
        { label: 'Account Members', href: '/v3/account/members' },
        { label: 'New Account Application', href: '/v3/account/new' },
        { label: 'Account Closure Request', href: '/v3/account/closure' },
    ]
</script>

<div class="content-wrapper">
    <!-- Account Detail Section -->
    <div>
        <div class="section-title mt-0! mb-6">
            <h1>Account Detail</h1>
                <div class="dropdown dropdown-end relative">
                  <button class="btn btn-square rounded-xl btn-ghost" onclick={() => menuOpen = !menuOpen}>
                      <Icon icon={menuOpen ? 'gg:close' : 'gg:menu-right'} width="32" />
                  </button>
                  {#if menuOpen}
                      <ul class="absolute right-0 top-full mt-2 w-72 rounded-xl bg-base-100 border border-gray-100 shadow-lg p-2 z-50">
                        {#each menuItems as item}
                            <li>
                                <a href={item.href} class="block px-4 py-2 rounded-md font-medium text-sm">{item.label}</a>
                            </li>
                        {/each}
                      </ul>

                  {/if}
              </div>
        </div>
        <div>
            <div class="data">
                <div class="lbl">Merchant Name</div>
                <div class="val">{accountItem.merchantName}</div>
            </div>
            <div class="data">
                <div class="lbl">Account Type</div>
                <div class="val">{accountItem.accountType}</div>
            </div>
            <div class="data">
                <div class="lbl">Address</div>
                <div class="val">{accountItem.address}</div>
            </div>
            <div class="data">
                <div class="lbl">Phone No.</div>
                <div class="val">{accountItem.phoneNo}</div>
            </div>
            <div class="data">
                <div class="lbl">ISR Code</div>
                <div class="val">{accountItem.isrCode}</div>
            </div>
            <div class="data">
                <div class="lbl">SAP Code</div>
                <div class="val">{accountItem.sapCode}</div>
            </div>
            <div class="data">
                <div class="lbl">Company Code</div>
                <div class="val">{accountItem.companyCode}</div>
            </div>
            <div class="data">
                <div class="lbl">Owner</div>
                <div class="val">{accountItem.owner}</div>
            </div>
            <div class="data">
                <div class="lbl">Dealer</div>
                <div class="val">{accountItem.dealer}</div>
            </div>

        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    h1 {
        @apply mb-0 text-lg font-semibold leading-9;
    }

     .section-title {
        @apply flex items-center justify-between mt-6 mb-6;
    }

    .data {
         @apply sm:grid sm:grid-cols-2 gap-1;

         .lbl {
             @apply mb-1 text-xs text-gray-400 sm:text-sm;
         }

        .val {
             @apply text-sm font-medium;
         }

         &:not(:last-child) {
             @apply mb-4;
         }
     }
</style>
