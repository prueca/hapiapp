class Create {
    currentStep = $state<1 | 2 | 3>(1)

    setCurrentStep(step: 1 | 2 | 3) {
        this.currentStep = step
    }
}

export default new Create()
