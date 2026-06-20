import { reactive, ref, computed, provide, inject } from 'vue'
import { sessions } from '../mocks/sessions.js'
import { addons } from '../mocks/addons.js'
import { overlaps } from '../utils/validators.js'

const REGISTRATION_KEY = Symbol('registration')

/**
 * Central registration store — the single source of truth for everything the
 * user enters across the 4 steps. Provided once by the layout so step pages can
 * mount/unmount freely without losing data, and the Review step can read it all.
 */
export function provideRegistration() {
  const attendee = reactive({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    shippingAddress: '',
  })

  const ticketTypeId = ref(null)

  // Step 3 — add-ons (declared early to support toggleSession auto-filter)
  const workshopIds = ref([])

  // Step 2 — session selection. Conflicts are allowed here and validated at
  // Review (per spec); only capacity-full sessions are non-selectable.
  const selectedSessionIds = ref([])
  function toggleSession(id) {
    const i = selectedSessionIds.value.indexOf(id)
    if (i === -1) selectedSessionIds.value.push(id)
    else selectedSessionIds.value.splice(i, 1)

    // Automatically resolve workshop-session conflicts inside the action
    const activeSessions = sessions.filter((s) => selectedSessionIds.value.includes(s.id))
    workshopIds.value = workshopIds.value.filter((wId) => {
      const w = addons.find((a) => a.id === wId)
      if (!w) return true
      return !activeSessions.some((s) => overlaps(w, s))
    })
  }
  function isSessionSelected(id) {
    return selectedSessionIds.value.includes(id)
  }

  // Flipped to true once the user attempts to submit (Review step). Gates the
  // inline error states so nothing turns red before a submit is attempted.
  const attemptedSubmit = ref(false)

  // Step 3 — add-ons. Workshops & meals are simple toggles; merchandise tracks
  // a quantity (and optional size) per item.
  const mealIds = ref([])
  const merch = reactive({}) // id -> { qty, size }

  function toggleIn(listRef, id) {
    const i = listRef.value.indexOf(id)
    if (i === -1) listRef.value.push(id)
    else listRef.value.splice(i, 1)
  }
  function toggleWorkshop(id) {
    toggleIn(workshopIds, id)
  }
  function toggleMeal(id) {
    toggleIn(mealIds, id)
  }
  function merchQty(id) {
    return merch[id]?.qty ?? 0
  }
  function merchSize(id) {
    return merch[id]?.size ?? null
  }
  function setMerchQty(id, qty) {
    const q = Math.max(0, qty)
    if (q === 0) delete merch[id]
    else merch[id] = { qty: q, size: merch[id]?.size ?? null }
  }
  function setMerchSize(id, size) {
    merch[id] = { qty: merch[id]?.qty ?? 0, size }
  }
  const hasMerchandise = computed(() => Object.values(merch).some((m) => m.qty > 0))

  // Step 4 — submission result.
  const submitted = ref(false)
  const confirmationId = ref(null)

  function reset() {
    Object.assign(attendee, {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      shippingAddress: '',
    })
    ticketTypeId.value = null
    selectedSessionIds.value = []
    workshopIds.value = []
    mealIds.value = []
    for (const k of Object.keys(merch)) delete merch[k]
    attemptedSubmit.value = false
    submitted.value = false
    confirmationId.value = null
  }

  const registration = {
    attendee,
    ticketTypeId,
    selectedSessionIds,
    toggleSession,
    isSessionSelected,
    attemptedSubmit,
    workshopIds,
    mealIds,
    merch,
    toggleWorkshop,
    toggleMeal,
    merchQty,
    merchSize,
    setMerchQty,
    setMerchSize,
    hasMerchandise,
    submitted,
    confirmationId,
    reset,
  }
  provide(REGISTRATION_KEY, registration)
  return registration
}

export function useRegistration() {
  const registration = inject(REGISTRATION_KEY)
  if (!registration) {
    throw new Error('useRegistration() must be called within provideRegistration()')
  }
  return registration
}
