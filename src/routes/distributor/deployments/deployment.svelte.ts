class Create {
    currentStep = $state<1 | 2 | 3>(1)

    freezers: Json[] = $state([])

    setCurrentStep(step: 1 | 2 | 3) {
        this.currentStep = step
    }

    addFreezer(freezer: Json) {
        this.freezers.push(freezer)
    }

    removeFreezer(freezerId: string) {
        this.freezers = this.freezers.filter((freezer) => freezer.id !== freezerId)
    }
}

export default new Create()
