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

  // Populated by the Add-ons step (later task). Kept here so the Attendee step
  // can react to whether merchandise was selected (shipping address requirement).
  const selectedAddons = ref([])
  const hasMerchandise = computed(() =>
    selectedAddons.value.some((a) => a.category === 'merchandise'),
  )

  const registration = {
    attendee,
    ticketTypeId,
    selectedSessionIds,
    toggleSession,
    isSessionSelected,
    attemptedSubmit,
    selectedAddons,
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
