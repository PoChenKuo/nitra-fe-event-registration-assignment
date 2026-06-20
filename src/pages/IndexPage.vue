<script setup>
import { computed, watchEffect } from 'vue'
import { useWizard } from '../composables/useWizard.js'
import { useRegistration } from '../composables/useRegistration.js'
import { useValidation } from '../composables/useValidation.js'
import AttendeeInfoStep from './steps/AttendeeInfoStep.vue'
import SessionsStep from './steps/SessionsStep.vue'
import AddonsStep from './steps/AddonsStep.vue'
import ReviewStep from './steps/ReviewStep.vue'
import SuccessScreen from '../components/SuccessScreen.vue'

const { currentStep, direction, setStepErrors } = useWizard()
const { submitted, attemptedSubmit } = useRegistration()
const { errorStepSet } = useValidation()

// Keep the stepper's error marks in sync with live validation once the user has
// attempted to submit (persists while they jump back to fix steps).
watchEffect(() => {
  setStepErrors(attemptedSubmit.value ? [...errorStepSet.value] : [])
})

const stepComponents = {
  1: AttendeeInfoStep,
  2: SessionsStep,
  3: AddonsStep,
  4: ReviewStep,
}
const activeComponent = computed(() => stepComponents[currentStep.value] ?? AttendeeInfoStep)

const transitionName = computed(() =>
  direction.value === 'forward' ? 'step-slide-next' : 'step-slide-prev',
)
</script>

<template>
  <q-page class="bg-surface-l0 overflow-hidden">
    <SuccessScreen v-if="submitted" />
    <transition v-else :name="transitionName" mode="out-in">
      <div :key="currentStep" class="mx-auto max-w-[1440px] px-[120px] py-[40px]">
        <component :is="activeComponent" />
      </div>
    </transition>
  </q-page>
</template>
