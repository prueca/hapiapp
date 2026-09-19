import {
     SORT_OPTIONS,
     type DeploymentGroup,
     type SortKey,
     type GroupedFreezer
} from '$lib/types/deployment'
import type { Freezer } from '$lib/types/freezer'
import type * as t from '$lib/drizzle/schema'
import api from '$lib/api'
import { invalidateAll } from '$app/navigation'
import { freezerStatus } from '$lib/config/freezer.options'
import _ from 'lodash'

type Account = typeof t.account.$inferSelect

const today = () => new Date().toISOString().slice(0, 10)

const isDeployedDate = (d: unknown): d is Date =>
     d instanceof Date && !Number.isNaN(d.getTime())

const toDateKey = (d: Date) => d.toISOString().slice(0, 10)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDate = (d: Date) =>
      `${MONTHS[d.getMonth()]}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}, ${WEEKDAYS[d.getDay()]}`

const startOfDayMs = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

const startOfTodayMs = () => {
     const now = new Date()
     return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

const isOverdue = (group: DeploymentGroup) =>
     isDeployedDate(group.deploymentDate) && toDateKey(group.deploymentDate) < today()

const daysOverdue = (group: DeploymentGroup) => {
     if (!isOverdue(group)) return 0
     return Math.round((startOfTodayMs() - startOfDayMs(group.deploymentDate!)) / 86_400_000)
}

const toDateInput = (d: unknown) => (isDeployedDate(d) ? toDateKey(d) : today())

const normalizeDate = (d: unknown): Date | null => {
     if (d == null) return null

     const parsed = d instanceof Date ? d : new Date(String(d))
     return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeGroups = (groups: DeploymentGroup[]): DeploymentGroup[] =>
     groups.map((group) => ({
          ...group,
          deploymentDate: normalizeDate(group.deploymentDate)
     }))

class Deployments {
    groups: DeploymentGroup[] = $state([])

     query = $state('')
     sort: SortKey = $state('deploymentDate-desc')
     filterStatus = $state<'all' | 'overdue' | 'not-overdue'>('all')
     activeTab = $state<'for-deployment' | 'available'>('for-deployment')

    pageSize = 12
    visibleCount = $state(12)

    openFilters = $state(false)

    sortOptions = SORT_OPTIONS

    searchQuery = $state('')
    searching = $state(false)
    searchedFreezer: Freezer | null = $state(null)
    searchedEligible = $state(false)
    searchedLastStatus = $state<string | null>(null)
    searchedFound = $state(false)

    selectedFreezerIds = $state<string[]>([])
    selectedFreezers: Freezer[] = $state([])

    accountQuery = $state('')
    accountSearching = $state(false)
    accountResults: Account[] = $state([])
    accountError = $state('')
    accounted = $state(false)
    designatedAccount: Account | null = $state(null)

    deploymentDate = $state(today())

    submitting = $state(false)
    submitError = $state('')
    submitSuccess = $state('')

     deployStep = $state<1 | 2 | 3>(1)
     stepLabels = ['Freezers', 'Account', 'Date']

      removing = $state<Set<string>>(new Set())

      editingGroup: DeploymentGroup | null = $state(null)
      editDate = $state(today())
      updating = $state<Set<string>>(new Set())
      updateError = $state('')

      isUpdating(key: string) {
          return this.updating.has(key)
       }

      isRemoving(id: string) {
         return this.removing.has(id)
     }

     async removeFreezer(freezer: GroupedFreezer) {
         const id = freezer.deploymentId

      if (this.removing.has(id)) return

      this.removing = new Set(this.removing).add(id)

       try {
           await api.post('deployments/status', {
               json: { deploymentId: id, status: freezerStatus.HOUSED_AVAILABLE }
            })

          this.groups = this.groups
               .map((group) => {
                  const freezers = group.freezers.filter((f) => f.deploymentId !== id)

                  return { ...group, freezers, quantity: freezers.length }
               })
               .filter((group) => group.freezers.length > 0)

          await invalidateAll()
        } catch (e: any) {
          const message = (e?.data?.message ?? e?.message ?? '') as string

          if (message) {
              this.submitError = message
            }
        } finally {
          const next = new Set(this.removing)
          next.delete(id)
          this.removing = next
        }
     }

    filtered = $derived(
         (() => {
             let source = this.groups

             const status = this.filterStatus
             if (status === 'overdue') {
                 source = source.filter(isOverdue)
            } else if (status === 'not-overdue') {
                 source = source.filter((group) => !isOverdue(group))
            }

             const q = _.toLower(_.trim(this.query))

             if (!q) return source

             return source.filter((group) => {
                 const designation = group.designation

                 const fields = [
                     designation?.name,
                     designation?.address,
                      ...group.freezers.flatMap((f) => [
                         f.brand,
                         f.model,
                         f.barcode,
                         String(f.capacity),
                         String(f.yearModel)
                      ])
                  ]

                 const haystack = fields
                      .filter((field): field is string => field != null)
                      .map((field) => _.toLower(field))

                 return haystack.some((field) => field.includes(q))
              })
             })()
      )

    sorted = $derived(sortGroups(this.filtered, this.sort))

    hasFilters = $derived(
         this.query !== '' || this.sort !== 'deploymentDate-desc' || this.filterStatus !== 'all'
     )

    visible = $derived(this.sorted.slice(0, this.visibleCount))
    canLoadMore = $derived(this.visibleCount < this.sorted.length)

    closeFilters() {
        this.openFilters = false
    }

    resetFilters() {
        this.query = ''
        this.sort = 'deploymentDate-desc'
        this.filterStatus = 'all'
     }

    resetVisibleCount() {
        this.visibleCount = this.pageSize
    }

    loadMore() {
        this.visibleCount += this.pageSize
    }

    load(groups: DeploymentGroup[]) {
        this.groups = normalizeGroups(groups)
        this.resetVisibleCount()
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

        this.accounted = true
        this.accountError = ''
        this.accountResults = []
        this.accountSearching = !q

        if (!q) {
            this.accountSearching = false
            return
        }

        try {
            const res = await api.post('accounts', { json: { query: q } })
            const body: Data<{ items: Account[] }> = await res.json()

            this.accountResults = body.data.items
        } catch (e: any) {
            this.accountError = e?.data?.message || 'Unable to search accounts.'
        } finally {
            this.accountSearching = false
        }
    }

    selectAccount(account: Account) {
        this.designatedAccount = account
        this.accountQuery = account.name
    }

    clearDesignation() {
        this.designatedAccount = null
        this.accountQuery = ''
    }

    async searchFreezerByBarcode() {
        const barcode = _.trim(this.searchQuery)

        if (!barcode) {
            this.searchedFreezer = null
            this.searchedFound = false
            this.searchedEligible = false
            this.searchedLastStatus = null
            return
        }

        this.searching = true
        this.searchedFreezer = null
        this.searchedFound = false

        try {
            const res = await api.post('freezers/by-barcode', { json: { barcode } })
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
    }

    resetBatch() {
        this.selectedFreezerIds = []
        this.selectedFreezers = []
        this.searchedFreezer = null
        this.searchedFound = false
        this.searchedEligible = false
        this.searchedLastStatus = null
        this.searchQuery = ''
        this.accountQuery = ''
        this.accountResults = []
        this.accounted = false
        this.designatedAccount = null
        this.deploymentDate = today()
        this.submitSuccess = ''
        this.submitError = ''
        this.deployStep = 1
    }

    canReachStep(step: number) {
        if (step <= this.deployStep) return true
        if (step === 1) return true
        if (this.selectedFreezerIds.length === 0) return false
        if (step === 3 && !this.designatedAccount) return false
        return true
    }

    goToStep(step: number) {
        if ((step === 1 || step === 2 || step === 3) && this.canReachStep(step)) {
            this.deployStep = step
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
        this.submitSuccess = ''

        try {
            const res = await api.post('deployments/batch', {
                json: {
                    freezerIds: this.selectedFreezerIds,
                    designationId: this.designatedAccount.id,
                    deploymentDate: this.deploymentDate
                }
            })

            const body: Data<{ count: number; deployments: unknown[] }> = await res.json()

            this.submitSuccess = `Deployed ${body.data.count} freezer${body.data.count === 1 ? '' : 's'} to ${this.designatedAccount.name}.`
            this.resetBatch()
        } catch (e: any) {
            const data = e?.data
            this.submitError =
                (data && (data.message ?? data.code)) ||
                e?.message ||
                'Something went wrong while deploying freezers.'
      } finally {
            this.submitting = false
          }
      }

      isOverdue(group: DeploymentGroup) {
          return isOverdue(group)
        }

      formatDate(d: Date) {
          return formatDate(d)
        }

      daysOverdue(group: DeploymentGroup) {
          return daysOverdue(group)
       }

      openEditDate(group: DeploymentGroup) {
          this.editingGroup = group
          this.editDate = toDateInput(group.deploymentDate)
          this.updateError = ''
       }

      closeEditDate() {
          this.editingGroup = null
          this.updateError = ''
       }

      async submitEditDate() {
          const group = this.editingGroup
          if (!group || this.isUpdating(group.key)) return

          this.updateError = ''

          const next = new Set(this.updating)
          next.add(group.key)
          this.updating = next

          try {
              await api.post('deployments/date', {
                  json: {
                       deploymentIds: group.freezers.map((f) => f.deploymentId),
                       deploymentDate: this.editDate
                  }
              })

              await invalidateAll()
              this.editingGroup = null
          } catch (e: any) {
              this.updateError =
                   e?.data?.message ?? e?.message ?? 'Something went wrong while updating the date.'
          } finally {
              const updated = new Set(this.updating)
              updated.delete(group.key)
              this.updating = updated
          }
      }
 }

const sortGroups = (groups: DeploymentGroup[], sort: SortKey) => {
     switch (sort) {
         case 'deploymentDate-desc':
             return _.orderBy(
                 groups,
                 [(g) => (isDeployedDate(g.deploymentDate) ? g.deploymentDate.getTime() : 0)],
                 ['desc']
              )

         default:
             return groups
       }
 }

const instance = new Deployments()

export default instance
