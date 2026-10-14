class Create {
    currentStep = $state<1 | 2 | 3>(1)

    freezers: string[] = $state([])

    setCurrentStep(step: 1 | 2 | 3) {
        this.currentStep = step
    }

    addFreezer(id: string) {
        this.freezers.push(id)
    }
}

export default new Create()
