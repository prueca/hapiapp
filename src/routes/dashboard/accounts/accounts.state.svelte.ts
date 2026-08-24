import _ from 'lodash'
import { goto } from '$app/navigation'

export interface Merchant {
    id: string
    name: string
    address: string
    phone: string
    isr_code: string
    sap_code: string
    company_code: string
    account_type: 'distributor' | 'dealer' | 'franchisee'
    associate_id: string
}

export type TypeFilter = 'all' | 'distributor' | 'dealer' | 'franchisee'
export type SortKey = 'name' | 'account_type' | 'id'
export type SortDir = 'asc' | 'desc'

const API_URL = 'https://localhost:3001/api/accounts'

class Accounts {
    API_URL = API_URL

    merchants = $state<Merchant[]>([])
    loading = $state(true)
    error = $state('')

    search = $state('')
    typeFilter = $state<TypeFilter>('all')
    sortBy = $state<SortKey>('name')
    sortDir = $state<SortDir>('asc')

    selected = $state<Merchant | null>(null)

    visible = $derived.by(() => {
        const filtered = this.merchants.filter((merchant) => {
            const query = _.toLower(_.trim(this.search))

            const matchesQuery =
                !query ||
                _.toLower(merchant.name).includes(query) ||
                _.toLower(merchant.id).includes(query)

            const matchesType =
                this.typeFilter === 'all' || merchant.account_type === this.typeFilter

            return matchesQuery && matchesType
        })

        const direction = this.sortDir === 'asc' ? 1 : -1

        return filtered
            .map((merchant) => ({ merchant }))
            .sort(
                (a, b) => a.merchant[this.sortBy].localeCompare(b.merchant[this.sortBy]) * direction
            )
            .map((item) => item.merchant)
    })

    async load() {
        try {
            this.loading = true
            this.error = ''

            const res = await fetch(this.API_URL)

            if (!res.ok) {
                this.error = `Failed to load accounts (${res.status}).`
                return
            }

            this.merchants = await res.json()
        } catch (e: any) {
            this.error = e.message ?? 'Failed to load accounts.'
        } finally {
            this.loading = false
        }
    }

    openDetail(merchant: Merchant) {
        this.selected = merchant
    }

    closeDetail() {
        this.selected = null
    }

    goToAddNew() {
        goto('/dashboard/accounts/form')
    }

    goToUpdate(merchant: Merchant) {
        this.closeDetail()
        goto('/dashboard/accounts/form?id=' + encodeURIComponent(merchant.id))
    }
}

export default new Accounts()
