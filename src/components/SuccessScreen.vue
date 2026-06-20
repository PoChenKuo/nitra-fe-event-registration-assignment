<script setup>
import { computed } from 'vue'
import { event } from '../mocks/event.js'
import { useRegistration } from '../composables/useRegistration.js'
import { useWizard } from '../composables/useWizard.js'
import { useOrderSummary } from '../composables/useOrderSummary.js'

const { attendee, confirmationId, reset } = useRegistration()
const { goToStep } = useWizard()
const { ticket } = useOrderSummary()

const firstName = computed(() => attendee.fullName.trim().split(/\s+/)[0] || 'there')
const ticketName = computed(() => ticket.value?.name ?? '')

function backToHome() {
  reset()
  goToStep(1)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-[16px] py-[60px] bg-surface-l0">
    <div class="flex items-center justify-center size-[80px] rounded-full bg-success-emphasis-rest">
      <q-icon name="check" size="44px" class="text-inverse" />
    </div>

    <p class="m-0 text-h2 text-success">Registration Complete!</p>
    <p class="m-0 text-lg text-neutral">Confirmation #{{ confirmationId }}</p>

    <div class="text-sm text-neutral-muted text-center">
      <p class="m-0">
        Thank you, {{ firstName }}! Your {{ ticketName }} registration for {{ event.name }} is
        confirmed.
      </p>
      <p class="m-0">You will receive a confirmation email at {{ attendee.email }}.</p>
    </div>

    <q-btn
      unelevated
      no-caps
      color="accent"
      label="Back to Home"
      class="rounded-[10px] text-md font-semibold px-[16px]"
      @click="backToHome"
    />
  </div>
</template>
