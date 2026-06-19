<script setup>
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard.js'
import AttendeeInfoStep from './steps/AttendeeInfoStep.vue'
import StepPlaceholder from './steps/StepPlaceholder.vue'

const { currentStep, direction } = useWizard()

// Map each step number to its page component. Steps 2–4 are placeholders until
// their tasks land.
const stepComponents = {
  1: AttendeeInfoStep,
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
