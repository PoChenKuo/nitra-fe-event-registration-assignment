import { ref, computed, provide, inject } from 'vue'
import { STEPS } from '../constants/steps.js'

const WIZARD_KEY = Symbol('wizard')

/**
 * Creates the wizard navigation state and provides it to descendants.
 * Call once from the layout that owns the wizard shell.
 */
export function provideWizard() {
  const steps = STEPS
  const currentStep = ref(1) // 1-based step number

  const currentIndex = computed(() => currentStep.value - 1)
  const currentMeta = computed(() => steps[currentIndex.value])
  const isFirst = computed(() => currentStep.value === 1)
  const isLast = computed(() => currentStep.value === steps.length)

  // Last navigation direction — drives the direction-aware page transition.
  const direction = ref('forward') // 'forward' | 'backward'

  // Step ids that currently have validation errors. Populated by the review/
  // validation step (later task); drives the stepper's error state.
  const errorSteps = ref(new Set())
  function setStepErrors(ids) {
    errorSteps.value = new Set(ids)
  }
  function clearStepErrors() {
    errorSteps.value = new Set()
  }

  function goToStep(n) {
    if (n < 1 || n > steps.length || n === currentStep.value) return
    direction.value = n > currentStep.value ? 'forward' : 'backward'
    currentStep.value = n
  }
  function goNext() {
    if (isLast.value) return
    direction.value = 'forward'
    currentStep.value += 1
  }
  function goBack() {
    if (isFirst.value) return
    direction.value = 'backward'
    currentStep.value -= 1
  }

  const wizard = {
    steps,
    currentStep,
    currentIndex,
    currentMeta,
    isFirst,
    isLast,
    direction,
    errorSteps,
    setStepErrors,
    clearStepErrors,
    goToStep,
    goNext,
    goBack,
  }
  provide(WIZARD_KEY, wizard)
  return wizard
}

/** Consumes the wizard state inside any descendant of the provider. */
export function useWizard() {
  const wizard = inject(WIZARD_KEY)
  if (!wizard) {
    throw new Error('useWizard() must be called within a component provided by provideWizard()')
  }
  return wizard
}
