import {
     SORT_OPTIONS,
     STATUS_OPTIONS,
     DEFAULT_STATUS_FILTER,
     type DeploymentRow,
     type DeploymentMeta,
     type SortKey,
     type StatusFilter
} from '$lib/types/deployment'
import type { Freezer } from '$lib/types/freezer'
import type * as t from '$lib/drizzle/schema'
import accountTypes from '$lib/config/account.types'
import api from '$lib/api'
import moment from 'moment'
import { invalidateAll, goto } from '$app/navigation'
import _ from 'lodash'

type Account = typeof t.account.$inferSelect

const today = () => new Date().toISOString().slice(0, 10)

const isDeployedDate = (d: unknown): d is Date => d instanceof Date && !Number.isNaN(d.getTime())

const toDateKey = (d: Date) => d.toISOString().slice(0, 10)

const formatDate = (d: Date) => moment(d).format('MMM-DD-YYYY, ddd')

const startOfDayMs = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

const startOfTodayMs = () => {
     const now = new Date()
     return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

const daysOverdueFromRow = (deployment: DeploymentRow) => {
     const date = deployment.deploymentDate
     if (!isDeployedDate(date)) return 0
     return Math.round((startOfTodayMs() - startOfDayMs(date)) / 86_400_000)
}

const toDateInput = (d: unknown) => (isDeployedDate(d) ? toDateKey(d) : today())

const errorText = (e: any, fallback: string) =>
     e?.data?.message ?? e?.data?.code ?? e?.message ?? fallback

const DEFAULT_SORT: SortKey = 'deploymentDate-desc'

let searchTimer: ReturnType<typeof setTimeout> | undefined

class Deployments {
     deployments: DeploymentRow[] = $state([])

     queryInput = $state('')
     sort: SortKey = $state(DEFAULT_SORT)
     filterStatus: StatusFilter = $state(DEFAULT_STATUS_FILTER)
     page = $state(1)
     hasMore = $state(false)

     canLoadMore = $state(false)

     activeTab = $state<'for-deployment' | 'available'>('for-deployment')

     openFilters = $state(false)

     sortOptions = SORT_OPTIONS
     statusOptions = STATUS_OPTIONS

     hasFilters = $derived(
          this.queryInput.trim().length > 0 ||
               this.sort !== DEFAULT_SORT ||
               this.filterStatus !== DEFAULT_STATUS_FILTER
     )

     searchQuery = $state('')
     searching = $state(false)
     searchedFreezer: Freezer | null = $state(null)
     searchedEligible = $state(false)
     searchedLastStatus: string | null = $state(null)
     searchedFound = $state(false)
     searchTried = $state(false)

     selectedFreezerIds = $state<string[]>([])
     selectedFreezers = $state<Freezer[]>([])

     accountQuery = $state('')
     accountType = $state<'dealer' | 'hapistore'>(accountTypes.DEALER)
     accountSearching = $state(false)
     accountResults: Account[] = $state([])
     accountError = $state('')
     designatedAccount: Account | null = $state(null)

     deploymentDate = $state(today())

     submitting = $state(false)
     submitError = $state('')

     editing: DeploymentRow | null = $state(null)
     deployStep = $state<1 | 2 | 3>(1)
     stepLabels = ['Freezers', 'Account', 'Date']

     isCreate = $derived(this.editing === null)

     deleting = $state<Set<string>>(new Set())
     pendingDelete: DeploymentRow | null = $state(null)
     deleteError = $state('')

     editingDeployment: DeploymentRow | null = $state(null)
     editDate = $state(today())
     updating = $state<Set<string>>(new Set())
     updateError = $state('')

      private go(page: number, patch: Partial<{ sort: SortKey; filterStatus: StatusFilter; query: string }>) {
           const params = new URLSearchParams()
           const sort = patch.sort ?? this.sort
           const filterStatus = patch.filterStatus ?? this.filterStatus
           const query = patch.query ?? this.queryInput

           if (sort && sort !== DEFAULT_SORT) params.set('sort', sort)
           if (filterStatus && filterStatus !== DEFAULT_STATUS_FILTER) {
                params.set('filterStatus', filterStatus)
            }
           if (query) params.set('query', query)
           if (page > 1) params.set('page', String(page))

           const base = typeof document !== 'undefined' ? document.location.pathname : ''
           const suffix = params.toString()
           goto(suffix ? `${base}?${suffix}` : base, { replaceState: true })
        }

      setSort(sort: SortKey) {
           this.sort = sort
           this.go(1, {})
       }

      setStatusFilter(filterStatus: StatusFilter) {
           this.filterStatus = filterStatus
           this.go(1, {})
       }

      onSearchInput() {
           if (searchTimer) clearTimeout(searchTimer)
           searchTimer = setTimeout(() => {
                this.go(1, { query: this.queryInput })
           }, 300)
       }

      loadMore() {
           if (!this.canLoadMore) return
           this.go(this.page + 1, {})
       }

      closeFilters() {
           this.openFilters = false
       }

      resetFilters() {
           if (searchTimer) clearTimeout(searchTimer)
           this.queryInput = ''
          this.sort = DEFAULT_SORT
          this.filterStatus = DEFAULT_STATUS_FILTER
          this.go(1, {})
        }

     load(rows: DeploymentRow[], meta: DeploymentMeta) {
          this.deployments = rows
          this.queryInput = meta.query
          this.sort = meta.sort
          this.filterStatus = meta.filterStatus
          this.page = meta.page
          this.hasMore = meta.hasMore
          this.canLoadMore = meta.hasMore
     }

     isSelected(freezerId: string) {
          return this.selectedFreezerIds.includes(freezerId)
     }

     toggleFreezer(freezer: Freezer, selected: boolean) {
          if (selected) {
               if (!this.isSelected(freezer.id)) {
                    this.selectedFreezerIds = [...this.selectedFreezerIds, freezer.id]
                    this.selectedFreezers = [...this.selectedFreezers, freezer]
                }

               return
             }

          this.selectedFreezerIds = _.without(this.selectedFreezerIds, freezer.id)
          this.selectedFreezers = this.selectedFreezers.filter((f) => f.id !== freezer.id)
     }

     async searchAccounts() {
          const q = _.trim(this.accountQuery)

          this.accountError = ''
          this.accountResults = []

          if (!q) {
               this.accountSearching = false
               return
             }

          this.accountSearching = true

          try {
               const res = await api.post('deployments/search/account', {
                    json: { query: q, type: this.accountType }
                })
               const body: Data<{ items: Account[] }> = await res.json()

               this.accountResults = body.data.items
             } catch (e: any) {
               this.accountError = errorText(e, 'Unable to search accounts.')
             } finally {
               this.accountSearching = false
             }
     }

     selectAccount(account: Account) {
          this.designatedAccount = account
          this.accountQuery = account.name
          this.accountType = (account.type as 'dealer' | 'hapistore') ?? this.accountType
     }

     setAccountType(type: 'dealer' | 'hapistore') {
          this.accountType = type
          this.accountResults = []
          this.searchAccounts()
     }

     clearDesignation() {
          this.designatedAccount = null
          this.accountQuery = ''
          this.accountResults = []
          this.accountType = 'dealer'
     }

     async searchFreezerByBarcode() {
          const barcode = _.trim(this.searchQuery)

          if (!barcode) {
               this.clearSearchedFreezer()
               return
             }

          this.searchTried = true
          this.searching = true
          this.searchedFreezer = null
          this.searchedEligible = false
          this.searchedLastStatus = null
          this.searchedFound = false

          try {
               const res = await api.post('deployments/search/freezer', { json: { barcode } })
               const body: Data<{
                    found: boolean
                    eligible: boolean
                    lastStatus: string | null
                    freezer: Freezer | null
                }> = await res.json()

               this.searchedFreezer = body.data.freezer
               this.searchedFound = body.data.found
               this.searchedEligible = body.data.eligible
               this.searchedLastStatus = body.data.lastStatus
             } catch (e: any) {
               this.searchedFreezer = null
               this.searchedFound = false
               this.searchedEligible = false
               this.searchedLastStatus = null
             } finally {
               this.searching = false
             }
     }

     clearSearchedFreezer() {
          this.searchQuery = ''
          this.searchedFreezer = null
          this.searchedFound = false
          this.searchedEligible = false
          this.searchedLastStatus = null
          this.searchTried = false
     }

     resetBatch() {
          this.selectedFreezerIds = []
          this.selectedFreezers = []
          this.clearSearchedFreezer()
          this.accountQuery = ''
          this.accountResults = []
          this.designatedAccount = null
          this.accountType = 'dealer'
          this.deploymentDate = today()
          this.submitError = ''
          this.deployStep = 1
          this.editing = null
     }

     cancelWizard() {
          this.resetBatch()
          this.activeTab = 'for-deployment'
     }

     openEdit(deployment: DeploymentRow) {
          this.editing = deployment
          this.submitError = ''

          const freezers = deployment.deploymentItems
               .map((item) => item.freezer)
               .filter((freezer): freezer is Freezer => freezer != null)

          this.selectedFreezerIds = freezers.map((freezer) => freezer.id)
          this.selectedFreezers = freezers
          this.designatedAccount =
               (deployment.designation as Account) ?? null

          if (this.designatedAccount) {
               this.accountQuery = this.designatedAccount.name
               this.accountType =
                    (this.designatedAccount.type as 'dealer' | 'hapistore') ?? this.accountType
            }

          this.deploymentDate = toDateInput(deployment.deploymentDate)
          this.deployStep = 3
          this.activeTab = 'available'
     }

     canReachStep(step: number) {
          if (step <= this.deployStep) return true
          if (this.selectedFreezerIds.length === 0) return false
          if (step === 3 && !this.designatedAccount) return false
          return true
     }

     goToStep(step: number) {
          if (step >= 1 && step <= 3 && this.canReachStep(step)) {
               this.deployStep = step as 1 | 2 | 3
               this.submitError = ''
          }
     }

     nextStep() {
          this.goToStep(Math.min(this.deployStep + 1, 3))
     }

     prevStep() {
          this.goToStep(Math.max(this.deployStep - 1, 1))
     }

     async submitBatch() {
          if (this.submitting) return

          if (!this.selectedFreezerIds.length) {
               this.submitError = 'Select at least one freezer to deploy.'
               return
          }

          if (!this.designatedAccount) {
               this.submitError = 'Please select a designation account.'
               return
          }

          this.submitting = true
          this.submitError = ''

          try {
               if (this.editing) {
                    await api.post('deployments/update', {
                         json: {
                              deploymentId: this.editing.id,
                              designationId: this.designatedAccount.id,
                              freezerIds: this.selectedFreezerIds,
                              deploymentDate: this.deploymentDate
                        }
                    })
                } else {
                    await api.post('deployments/batch', {
                         json: {
                              freezerIds: this.selectedFreezerIds,
                              designationId: this.designatedAccount.id,
                              deploymentDate: this.deploymentDate
                        }
                    })
                }

               await invalidateAll()
               this.resetBatch()
               this.activeTab = 'for-deployment'
          } catch (e: any) {
               this.submitError = errorText(e, 'Something went wrong while saving the deployment.')
          } finally {
               this.submitting = false
          }
     }

     requestDelete(deployment: DeploymentRow) {
          this.pendingDelete = deployment
          this.deleteError = ''
     }

     cancelDelete() {
          this.pendingDelete = null
          this.deleteError = ''
     }

     async confirmDelete() {
          const deployment = this.pendingDelete
          if (!deployment || this.isDeleting(deployment.id)) return

          const next = new Set(this.deleting)
          next.add(deployment.id)
          this.deleting = next

          try {
               await api.post('deployments/delete', {
                    json: { deploymentId: deployment.id }
                })

               this.deployments = this.deployments.filter((row) => row.id !== deployment.id)
               this.pendingDelete = null
               this.deleteError = ''

               await invalidateAll()
            } catch (e: any) {
               this.deleteError = errorText(e, 'Something went wrong while deleting the deployment.')
            } finally {
               const updated = new Set(this.deleting)
               updated.delete(deployment.id)
               this.deleting = updated
            }
     }

     isOverdue(deployment: DeploymentRow) {
          return !!deployment.overdue
     }

     formatDate(d: Date) {
          return formatDate(d)
     }

     daysOverdue(deployment: DeploymentRow) {
          return daysOverdueFromRow(deployment)
     }

     openEditDate(deployment: DeploymentRow) {
          this.editingDeployment = deployment
          this.editDate = toDateInput(deployment.deploymentDate)
          this.updateError = ''
     }

     closeEditDate() {
          this.editingDeployment = null
          this.updateError = ''
     }

     async submitEditDate() {
          const deployment = this.editingDeployment
          if (!deployment || this.isUpdating(deployment.id)) return

          this.updateError = ''

          const next = new Set(this.updating)
          next.add(deployment.id)
          this.updating = next

          try {
               await api.post('deployments/date', {
                    json: {
                         deploymentIds: [deployment.id],
                         deploymentDate: this.editDate
                    }
                })

               const nextDate = new Date(this.editDate)
               this.deployments = this.deployments.map((row) =>
                    row.id === deployment.id
                           ? {
                                 ...row,
                                deploymentDate: Number.isNaN(nextDate.getTime()) ? null : nextDate,
                                overdue:
                                     row.status === DEFAULT_STATUS_FILTER &&
                                       !Number.isNaN(nextDate.getTime())
                                           ? toDateKey(nextDate) < today()
                                           : false
                           }
                           : row
                 )

               await invalidateAll()
               this.editingDeployment = null
          } catch (e: any) {
               this.updateError = errorText(e, 'Something went wrong while updating the date.')
            } finally {
               const updated = new Set(this.updating)
               updated.delete(deployment.id)
               this.updating = updated
            }
     }

     isUpdating(key: string) {
          return this.updating.has(key)
     }

     isDeleting(id: string) {
          return this.deleting.has(id)
     }
}

const instance = new Deployments()

export default instance
