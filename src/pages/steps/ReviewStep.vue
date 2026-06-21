<script setup>
import { computed } from 'vue'
import { STEP } from '../../constants/steps.js'
import { sessions } from '../../mocks/sessions.js'
import { addons } from '../../mocks/addons.js'
import { useRegistration } from '../../composables/useRegistration.js'
import { useValidation } from '../../composables/useValidation.js'
import { useOrderSummary } from '../../composables/useOrderSummary.js'
import { isEmail, isValidE164Phone } from '../../utils/validators.js'
import { formatDateLabel, formatTime } from '../../utils/datetime.js'
import { formatCurrency } from '../../utils/currency.js'
import ReviewSection from '../../components/ReviewSection.vue'
import ErrorBanner from '../../components/ErrorBanner.vue'

const reg = useRegistration()
const { errorList, errorsByStep } = useValidation()
const { ticket, lines, workshopDiscount, total } = useOrderSummary()

const showErrors = computed(() => reg.attemptedSubmit.value)
const sectionError = (step) => showErrors.value && (errorsByStep.value[step]?.length ?? 0) > 0

// Per-field error text for the Attendee section (shown red in place of value).
const fieldErr = computed(() => {
  if (!showErrors.value) return {}
  const a = reg.attendee
  return {
    name: !a.fullName.trim() ? '— (required)' : null,
    email: !a.email.trim() ? '— (required)' : !isEmail(a.email) ? '— (invalid)' : null,
    phone: !a.phone.trim() ? '— (required)' : !isValidE164Phone(a.phone) ? '— (invalid)' : null,
    company: !a.company.trim() ? '— (required)' : null,
    jobTitle: !a.jobTitle.trim() ? '— (required)' : null,
    ticket: !reg.ticketTypeId.value ? '— (required)' : null,
    shipping:
      reg.hasMerchandise.value && !a.shippingAddress.trim()
        ? '— (required for merchandise)'
        : null,
  }
})

const attendeeRows = computed(() => {
  const a = reg.attendee
  const f = fieldErr.value
  const t = ticket.value
  const rows = [
    { label: 'Name', value: a.fullName, err: f.name },
    { label: 'Email', value: a.email, err: f.email },
    { label: 'Phone', value: a.phone, err: f.phone },
    { label: 'Company', value: a.company, err: f.company },
    { label: 'Job Title', value: a.jobTitle, err: f.jobTitle },
    { label: 'Ticket Type', value: t ? `${t.name} ($${t.price})` : '', err: f.ticket },
  ]
  if (reg.hasMerchandise.value) {
    rows.push({ label: 'Shipping Address', value: a.shippingAddress, err: f.shipping })
  }
  return rows
})

const sessionRows = computed(() =>
  sessions
    .filter((s) => reg.selectedSessionIds.value.includes(s.id))
    .map((s) => ({ label: `${formatDateLabel(s.date)}, ${formatTime(s.date)}`, value: s.title })),
)

const addonRows = computed(() => {
  const rows = []
  for (const id of reg.workshopIds.value) {
    const w = addons.find((a) => a.id === id)
    if (w) rows.push({ label: 'Workshop', value: `${w.name} ($${w.price})` })
  }
  for (const id of reg.mealIds.value) {
    const m = addons.find((a) => a.id === id)
    if (m) rows.push({ label: 'Meal', value: `${m.name} ($${m.price})` })
  }
  for (const [id, v] of Object.entries(reg.merch)) {
    if (v.qty > 0) {
      const p = addons.find((a) => a.id === id)
      if (p) rows.push({ label: 'Merchandise', value: `${p.name} × ${v.qty} ($${p.price * v.qty})` })
    }
  }
  return rows
})
</script>

<template>
  <section class="flex flex-col gap-[24px]">
    <ErrorBanner v-if="showErrors && errorList.length" :errors="errorList" />
    <h2 class="text-h3 text-neutral mt-0 mb-0">Review Your Registration</h2>


    <!-- Attendee -->
    <ReviewSection title="Attendee Information" :edit-step="STEP.ATTENDEE" :error="sectionError(STEP.ATTENDEE)">
      <div v-for="r in attendeeRows" :key="r.label" class="flex justify-between gap-[16px] w-full text-sm">
        <span class="shrink-0 text-neutral-muted">{{ r.label }}</span>
        <span class="text-right" :class="r.err ? 'text-danger' : 'text-neutral'">
          {{ r.err || r.value }}
        </span>
      </div>
    </ReviewSection>

    <!-- Sessions -->
    <ReviewSection title="Selected Sessions" :edit-step="STEP.SESSIONS" :error="sectionError(STEP.SESSIONS)">
      <div v-for="r in sessionRows" :key="r.value" class="flex justify-between gap-[16px] w-full text-sm">
        <span class="shrink-0 text-neutral-muted">{{ r.label }}</span>
        <span class="text-right text-neutral">{{ r.value }}</span>
      </div>
      <p v-if="!sessionRows.length" class="m-0 text-sm text-neutral-quiet">No sessions selected</p>
    </ReviewSection>

    <!-- Add-ons -->
    <ReviewSection title="Add-ons" :edit-step="STEP.ADDONS" :error="sectionError(STEP.ADDONS)">
      <div v-for="(r, i) in addonRows" :key="i" class="flex justify-between gap-[16px] w-full text-sm">
        <span class="shrink-0 text-neutral-muted">{{ r.label }}</span>
        <span class="text-right text-neutral">{{ r.value }}</span>
      </div>
      <p v-if="!addonRows.length" class="m-0 text-sm text-neutral-quiet">No add-ons selected</p>
    </ReviewSection>

    <!-- Pricing Summary -->
    <div class="flex flex-col gap-[12px] p-[20px] rounded-[6px] bg-surface-l1 border border-neutral-muted">
      <h3 class="text-subtitle1 text-neutral mt-0 mb-0">Pricing Summary</h3>
      <div class="flex justify-between w-full text-sm text-neutral-muted">
        <span>{{ ticket ? `${ticket.name} Ticket` : 'No ticket selected' }}</span>
        <span class="shrink-0 pl-[12px]">{{ ticket ? formatCurrency(ticket.price) : '—' }}</span>
      </div>
      <div
        v-for="(l, i) in lines"
        :key="i"
        class="flex justify-between w-full text-sm text-neutral-muted"
      >
        <span>{{ l.label }}</span>
        <span class="shrink-0 pl-[12px]">{{ formatCurrency(l.amount) }}</span>
      </div>
      <div
        v-if="workshopDiscount > 0"
        class="flex justify-between w-full text-xs text-brand-emphasis"
      >
        <span>Workshop discount (VIP 10%)</span>
        <span class="shrink-0 pl-[12px]">{{ formatCurrency(-workshopDiscount) }}</span>
      </div>
      <div class="h-px w-full bg-[var(--divider-muted)]" />
      <div class="flex justify-between w-full text-sm font-medium text-neutral">
        <span>Grand Total</span>
        <span class="shrink-0 pl-[12px]">{{ formatCurrency(total) }}</span>
      </div>
    </div>
  </section>
</template>
