// Named step ids — single source of truth so nothing references bare numbers.
export const STEP = {
  ATTENDEE: 1,
  SESSIONS: 2,
  ADDONS: 3,
  REVIEW: 4,
}

// Wizard step definitions. `label` drives the stepper; `nextLabel` drives the
// footer primary button.
export const STEPS = [
  { id: STEP.ATTENDEE, key: 'attendee', label: 'Attendee Info', nextLabel: 'Next: Session Selection' },
  { id: STEP.SESSIONS, key: 'sessions', label: 'Sessions', nextLabel: 'Next: Add-ons' },
  { id: STEP.ADDONS, key: 'addons', label: 'Add-ons', nextLabel: 'Next: Review' },
  { id: STEP.REVIEW, key: 'review', label: 'Review', nextLabel: 'Submit Registration' },
]
