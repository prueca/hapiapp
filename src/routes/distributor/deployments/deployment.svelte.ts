class Deployment {
    currentStep = $state<1 | 2 | 3>(1)

    freezers: Json[] = $state([])

    destinationAccount: Json | null = $state(null)

    deploymentDate: string | null = $state(null)

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
}

export default new Deployment()
