<script setup>
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard.js'
import AttendeeInfoStep from './steps/AttendeeInfoStep.vue'
import SessionsStep from './steps/SessionsStep.vue'
import AddonsStep from './steps/AddonsStep.vue'
import StepPlaceholder from './steps/StepPlaceholder.vue'

const { currentStep, direction } = useWizard()

// Map each step number to its page component. Step 4 is a placeholder until
// its task lands.
const stepComponents = {
  1: AttendeeInfoStep,
  2: SessionsStep,
  3: AddonsStep,
}
const activeComponent = computed(() => stepComponents[currentStep.value] ?? StepPlaceholder)

const transitionName = computed(() =>
  direction.value === 'forward' ? 'step-slide-next' : 'step-slide-prev',
)
</script>

<template>
  <q-page class="bg-surface-l0 overflow-hidden">
    <transition :name="transitionName" mode="out-in">
      <div :key="currentStep" class="mx-auto max-w-[1440px] px-[120px] py-[40px]">
        <component :is="activeComponent" />
      </div>
    </transition>
  </q-page>
</template>
