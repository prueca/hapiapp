<script lang="ts">
     import Dock from '../../components/Dock.svelte'
     import TopBar from '../../components/TopBar'
     import type { DeploymentRow, DeploymentMeta } from '$lib/types/deployment'
       import List from './components/List.svelte'
       import Toolbar from './components/Toolbar.svelte'
       import EditDate from './components/EditDate.svelte'
       import ConfirmDelete from './components/ConfirmDelete.svelte'
      import DeployFreezers from './components/DeployFreezers.svelte'
      import state from './deployments.context.svelte'

     let { data }: { data: { data: DeploymentRow[]; meta: DeploymentMeta } } = $props()
</script>

<div class="content-wrapper">
     <TopBar />

      <div class="mb-21">
           <div class="px-4">
                <div class="tabs-border tabs flex w-full" role="tablist">
                     <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                     <label
                        id="tab-for-deployment"
                        class="tab flex-1"
                        role="tab"
                        aria-selected={state.activeTab === 'for-deployment'}
                     >
                         <input
                            type="radio"
                            name="deployment-tabs"
                            bind:group={state.activeTab}
                            value="for-deployment"
                         />
                         <span class="px-1 md:px-4">For Deployment</span>
                     </label>
                    <div
                       class="tab-content p-2 md:px-0"
                       role="tabpanel"
                       aria-labelledby="tab-for-deployment"
                    >
                            {#if state.activeTab === 'for-deployment'}
                               <div class="overflow-hidden rounded-lg bg-white">
                                   <Toolbar />

                                    <EditDate />

                                <ConfirmDelete />

                                    <List rows={data.data} meta={data.meta} />
                          </div>
                      {/if}
                    </div>

                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <label
                      id="tab-available"
                     class="tab flex-1"
                      role="tab"
                      aria-selected={state.activeTab === 'available'}
                  >
                      <input
                         type="radio"
                         name="deployment-tabs"
                         bind:group={state.activeTab}
                         value="available"
                      />
                      <span class="px-1 md:px-4">Available Freezers for Deployment</span>
                  </label>
                  <div
                     class="tab-content p-2 md:px-0"
                     role="tabpanel"
                     aria-labelledby="tab-available"
                  >
                      {#if state.activeTab === 'available'}
                          <div class="overflow-hidden rounded-lg bg-white p-4">
                              <DeployFreezers />
                          </div>
                      {/if}
                  </div>
              </div>
          </div>
      </div>

      <Dock />
</div>

<style lang="postcss">
     @reference 'tailwindcss';
</style>