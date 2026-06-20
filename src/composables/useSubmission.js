import { computed } from 'vue'
import { event } from '../mocks/event.js'
import { useRegistration } from './useRegistration.js'
import { useValidation } from './useValidation.js'

function makeConfirmation() {
  const year = new Date(event.dates[0]).getUTCFullYear()
  const n = Math.floor(10000 + Math.random() * 90000)
  return `TC${year}-${n}`
}

/**
 * Submit action for the Review step. Validation marks errors (the stepper sync
 * lives in IndexPage); on a clean pass it records a confirmation and flips the
 * app into the success state.
 */
export function useSubmission() {
  const reg = useRegistration()
  const { errorList, isValid } = useValidation()

  // After an attempt, the primary button is disabled until errors are resolved.
  const canSubmit = computed(() => !(reg.attemptedSubmit.value && !isValid.value))

  function submit() {
    reg.attemptedSubmit.value = true
    if (!isValid.value) return
    reg.confirmationId.value = makeConfirmation()
    reg.submitted.value = true
  }

  return { errorList, isValid, canSubmit, submit }
}
