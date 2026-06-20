import { reactive, ref, computed, provide, inject } from 'vue'

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

  // Step 2 — session selection. Conflicts are allowed here and validated at
  // Review (per spec); only capacity-full sessions are non-selectable.
  const selectedSessionIds = ref([])
  function toggleSession(id) {
    const i = selectedSessionIds.value.indexOf(id)
    if (i === -1) selectedSessionIds.value.push(id)
    else selectedSessionIds.value.splice(i, 1)
  }
  function isSessionSelected(id) {
    return selectedSessionIds.value.includes(id)
  }

  // Flipped to true once the user attempts to submit (Review step). Gates the
  // inline error states so nothing turns red before a submit is attempted.
  const attemptedSubmit = ref(false)

  // Step 3 — add-ons. Workshops & meals are simple toggles; merchandise tracks
  // a quantity (and optional size) per item.
  const workshopIds = ref([])
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
