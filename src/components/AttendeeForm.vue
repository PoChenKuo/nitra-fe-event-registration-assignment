<script setup>
import { computed } from 'vue'
import { useRegistration } from '../composables/useRegistration.js'
import FormField from './FormField.vue'

const { attendee, hasMerchandise, attemptedSubmit } = useRegistration()

// Shipping address is optional until merchandise is added in the Add-ons step.
const shippingLabel = computed(() =>
  hasMerchandise.value ? 'Shipping Address' : 'Shipping Address (Optional)',
)
const shippingError = computed(
  () => attemptedSubmit.value && hasMerchandise.value && !attendee.shippingAddress.trim(),
)
</script>

<template>
  <!-- No inline validation on the regular fields — that runs at the Review step.
       Only the shipping field carries the conditional required/error status. -->
  <q-form class="grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[20px]">
    <FormField v-model="attendee.fullName" label="Full Name" placeholder="Enter your full name" />
    <FormField
      v-model="attendee.email"
      label="Email"
      type="email"
      placeholder="Enter your email address"
    />
    <FormField
      v-model="attendee.phone"
      label="Phone"
      type="tel"
      placeholder="Enter your phone number"
    />
    <FormField v-model="attendee.company" label="Company" placeholder="Enter your company name" />
    <FormField
      v-model="attendee.jobTitle"
      label="Job Title"
      placeholder="Enter your job title"
      class="sm:col-span-2"
    />
    <FormField
      v-model="attendee.shippingAddress"
      :label="shippingLabel"
      :required="hasMerchandise"
      :error="shippingError"
      error-message="Shipping address is required for merchandise orders"
      placeholder="Enter your shipping address"
      class="sm:col-span-2"
    />
  </q-form>
</template>
