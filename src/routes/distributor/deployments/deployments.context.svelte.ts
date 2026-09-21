import {
     SORT_OPTIONS,
     type DeploymentRow,
     type DeploymentItemWithFreezer,
     type SortKey
 } from '$lib/types/deployment'
import type { Freezer } from '$lib/types/freezer'
import type * as t from '$lib/drizzle/schema'
import accountTypes from '$lib/config/account.types'
import api from '$lib/api'
import moment from 'moment'
import { invalidateAll } from '$app/navigation'
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

const isOverdue = (deployment: DeploymentRow) =>
    isDeployedDate(deployment.deploymentDate) && toDateKey(deployment.deploymentDate) < today()

const daysOverdue = (deployment: DeploymentRow) => {
    if (!isOverdue(deployment)) return 0
    return Math.round((startOfTodayMs() - startOfDayMs(deployment.deploymentDate!)) / 86_400_000)
}

const toDateInput = (d: unknown) => (isDeployedDate(d) ? toDateKey(d) : today())

const errorText = (e: any, fallback: string) =>
    e?.data?.message ?? e?.data?.code ?? e?.message ?? fallback

const deploymentMatchesQuery = (deployment: DeploymentRow, q: string) => {
    const fields = [
        deployment.designation?.name,
        deployment.designation?.address,
         ...deployment.deploymentItems.flatMap((item) => {
            const freezer = item.freezer

            return [
                freezer?.brand,
                freezer?.model,
                freezer?.barcode,
                freezer ? String(freezer.capacity) : null,
                freezer ? String(freezer.yearModel) : null
             ]
        })
    ]

    const haystack = fields
         .filter((field): field is string => field != null)
         .map((field) => _.toLower(field))

    return haystack.some((field) => field.includes(q))
}

const filterDeployments = (deployments: DeploymentRow[], status: string, query: string) => {
    let source = deployments

    if (status === 'overdue') {
        source = source.filter(isOverdue)
     } else if (status === 'not-overdue') {
        source = source.filter((deployment) => !isOverdue(deployment))
     }

    const q = _.toLower(_.trim(query))
    if (!q) return source

    return source.filter((deployment) => deploymentMatchesQuery(deployment, q))
}

const sortDeployments = (deployments: DeploymentRow[], sort: SortKey) => {
    switch (sort) {
        case 'deploymentDate-desc':
            return _.orderBy(
                deployments,
                [(d) => (isDeployedDate(d.deploymentDate) ? d.deploymentDate.getTime() : 0)],
                ['desc']
            )

        default:
            return deployments
     }
}

const normalizeDate = (d: unknown): Date | null => {
    if (d == null) return null

    const parsed = d instanceof Date ? d : new Date(String(d))
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeDeployments = (deployments: DeploymentRow[]): DeploymentRow[] =>
    deployments.map((deployment) => ({
         ...deployment,
        deploymentDate: normalizeDate(deployment.deploymentDate)
     }))

class Deployments {
    deployments: DeploymentRow[] = $state([])

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
    searchTried = $state(false)

    selectedFreezerIds = $state<string[]>([])
    selectedFreezers: Freezer[] = $state([])

    accountQuery = $state('')
    accountType = $state<'dealer' | 'hapistore'>(accountTypes.DEALER)
    accountSearching = $state(false)
    accountResults: Account[] = $state([])
    accountError = $state('')
    designatedAccount: Account | null = $state(null)

    deploymentDate = $state(today())

    submitting = $state(false)
    submitError = $state('')

    deployStep = $state<1 | 2 | 3>(1)
    stepLabels = ['Freezers', 'Account', 'Date']

    removing = $state<Set<string>>(new Set())

    editingDeployment: DeploymentRow | null = $state(null)
    editDate = $state(today())
    updating = $state<Set<string>>(new Set())
    updateError = $state('')

    filtered = $derived(filterDeployments(this.deployments, this.filterStatus, this.query))

    sorted = $derived(sortDeployments(this.filtered, this.sort))

    hasFilters = $derived(
        this.query !== '' || this.sort !== 'deploymentDate-desc' || this.filterStatus !== 'all'
    )

    visible = $derived(this.sorted.slice(0, this.visibleCount))
    canLoadMore = $derived(this.visibleCount < this.sorted.length)

    isUpdating(key: string) {
        return this.updating.has(key)
    }

    isRemoving(id: string) {
        return this.removing.has(id)
    }

    async removeFreezer(item: DeploymentItemWithFreezer) {
        const id = item.id

        if (this.removing.has(id)) return

        this.removing = new Set(this.removing).add(id)

        try {
            await api.post('deployments/items', {
                json: { itemId: id }
             })

            this.deployments = this.deployments
                  .map((deployment) => {
                    const deploymentItems = deployment.deploymentItems.filter(
                          (i) => i.id !== id
                       )

                    return { ...deployment, deploymentItems }
                  })
                  .filter((deployment) => deployment.deploymentItems.length > 0)

            await invalidateAll()
          } catch (e: any) {
            const message = errorText(e, '')

            if (message) {
                this.submitError = message
             }
          } finally {
            const next = new Set(this.removing)
            next.delete(id)
            this.removing = next
          }
      }

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

    load(deployments: DeploymentRow[]) {
        this.deployments = normalizeDeployments(deployments)
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
        this.accountType = accountTypes.DEALER
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
        this.accountType = accountTypes.DEALER
        this.deploymentDate = today()
        this.submitError = ''
        this.deployStep = 1
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
            await api.post('deployments/batch', {
                json: {
                    freezerIds: this.selectedFreezerIds,
                    designationId: this.designatedAccount.id,
                    deploymentDate: this.deploymentDate
                }
            })

            await invalidateAll()
            this.resetBatch()
            this.activeTab = 'for-deployment'
        } catch (e: any) {
            this.submitError = errorText(e, 'Something went wrong while deploying freezers.')
        } finally {
            this.submitting = false
        }
    }

    isOverdue(deployment: DeploymentRow) {
        return isOverdue(deployment)
       }

    formatDate(d: Date) {
        return formatDate(d)
       }

    daysOverdue(deployment: DeploymentRow) {
        return daysOverdue(deployment)
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
}

const instance = new Deployments()

export default instance
