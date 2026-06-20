import { computed } from 'vue'
import { sessions } from '../mocks/sessions.js'
import { addons } from '../mocks/addons.js'
import { useRegistration } from './useRegistration.js'
import { STEP } from '../constants/steps.js'
import { isEmail, isPhone, overlaps } from '../utils/validators.js'

/**
 * Unified validation across all steps, evaluated on the Review step.
 * Returns per-step error lists, a flat list (for the banner), the set of steps
 * with errors (for the stepper), and overall validity.
 */
export function useValidation() {
  const reg = useRegistration()

  const attendeeErrors = computed(() => {
    const a = reg.attendee
    const e = []
    if (!a.fullName.trim()) e.push('Full name is required')
    if (!a.email.trim()) e.push('Email is required')
    else if (!isEmail(a.email)) e.push('Email is invalid')
    if (!a.phone.trim()) e.push('Phone number is required')
    else if (!isPhone(a.phone)) e.push('Phone number is invalid')
    if (!a.company.trim()) e.push('Company is required')
    if (!a.jobTitle.trim()) e.push('Job title is required')
    if (!reg.ticketTypeId.value) e.push('Ticket type is required')
    if (reg.hasMerchandise.value && !a.shippingAddress.trim())
      e.push('Shipping address is required for merchandise orders')
    return e
  })

  const selectedSessions = computed(() =>
    sessions.filter((s) => reg.selectedSessionIds.value.includes(s.id)),
  )

  const sessionErrors = computed(() => {
    const sel = selectedSessions.value
    const e = []
    for (let i = 0; i < sel.length; i++) {
      for (let j = i + 1; j < sel.length; j++) {
        if (overlaps(sel[i], sel[j])) {
          e.push(`"${sel[i].title}" overlaps with "${sel[j].title}"`)
        }
      }
    }
    return e
  })

  const addonErrors = computed(() => {
    const e = []
    // Re-check workshop ↔ session conflicts (state may have changed since Step 3).
    for (const id of reg.workshopIds.value) {
      const w = addons.find((a) => a.id === id)
      if (w && selectedSessions.value.some((s) => overlaps(w, s))) {
        e.push(`Workshop "${w.name}" conflicts with a selected session`)
      }
    }
    // Sized merchandise must have a size chosen.
    for (const [id, v] of Object.entries(reg.merch)) {
      if (v.qty > 0) {
        const m = addons.find((a) => a.id === id)
        if (m?.sizes && !v.size) e.push(`Please select a size for "${m.name}"`)
      }
    }
    return e
  })

  const errorsByStep = computed(() => ({
    [STEP.ATTENDEE]: attendeeErrors.value,
    [STEP.SESSIONS]: sessionErrors.value,
    [STEP.ADDONS]: addonErrors.value,
  }))

  const errorList = computed(() => {
    const out = []
    for (const [step, errs] of Object.entries(errorsByStep.value)) {
      for (const message of errs) out.push({ step: Number(step), message })
    }
    return out
  })

  const errorStepSet = computed(() => new Set(errorList.value.map((e) => e.step)))
  const isValid = computed(() => errorList.value.length === 0)

  return { attendeeErrors, sessionErrors, addonErrors, errorsByStep, errorList, errorStepSet, isValid }
}
