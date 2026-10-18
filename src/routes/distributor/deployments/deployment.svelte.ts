import api from '$lib/api'

class Deployment {
    currentStep = $state<1 | 2 | 3>(1)

    freezers: Json[] = $state([])

    destinationAccount: Json | null = $state(null)

    deploymentDate: string | null = $state(null)

    loading = $state(false)

    success = $state(false)

    error: App.Error | null = $state(null)

    data: Json | null = $state(null)

    setCurrentStep(step: 1 | 2 | 3) {
        this.currentStep = step
    }

    addFreezer(freezer: Json) {
        this.freezers.push(freezer)
    }

    removeFreezer(freezerId: string) {
        this.freezers = this.freezers.filter((freezer) => freezer.id !== freezerId)
    }

    setDestinationAccount(account: Json | null) {
        this.destinationAccount = account
    }

    submit() {
        const isComplete = !this.freezers.length || !this.destinationAccount || !this.deploymentDate

        if (isComplete) return

        // Todo: send post request
    }

    reset() {
        this.loading = false
        this.success = false
        this.error = null
        this.data = null
    }
}

export default new Deployment()
