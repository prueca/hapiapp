import type Account from '$lib/db/Account'

class SearchContext {
    accounts: Promise<Account[]> | Account[] | null = $state(null)

    query = $state('')
    openSearchOptions = $state(false)

    submit() {
        this.accounts = new Promise((resolve) => {
            setTimeout(() => resolve([]), 4000)
        })
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new SearchContext()
