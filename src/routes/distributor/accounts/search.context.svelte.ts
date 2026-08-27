class SearchContext {
    query = $state('')
    openSearchOptions = $state(false)

    submit() {
        console.log('Sending request...')
    }

    toggleSearchOptions() {
        this.openSearchOptions = !this.openSearchOptions
    }
}

export default new SearchContext()
