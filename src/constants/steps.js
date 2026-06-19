// Wizard step definitions — single source of truth for the 4-step flow.
// `label` drives the stepper; `nextLabel` drives the footer primary button.
export const STEPS = [
  { id: 1, key: 'attendee', label: 'Attendee Info', nextLabel: 'Next: Session Selection' },
  { id: 2, key: 'sessions', label: 'Sessions', nextLabel: 'Next: Add-ons' },
  { id: 3, key: 'addons', label: 'Add-ons', nextLabel: 'Next: Review' },
  { id: 4, key: 'review', label: 'Review', nextLabel: 'Submit Registration' },
]
