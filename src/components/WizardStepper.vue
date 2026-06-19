<script setup>
import { computed } from 'vue'
import { useWizard } from '../composables/useWizard.js'

const { steps, currentStep, errorSteps, goToStep } = useWizard()

// Resolve each step's visual state. Error takes priority (a step can hold a
// validation error regardless of where the cursor is, e.g. on the Review step).
function stateOf(stepId) {
  if (errorSteps.value.has(stepId)) return 'error'
  if (stepId < currentStep.value) return 'completed'
  if (stepId === currentStep.value) return 'active'
  return 'inactive'
}

const items = computed(() =>
  steps.map((step, i) => ({
    step,
    state: stateOf(step.id),
    // connector after this step is "filled" once the step is behind the cursor
    connectorFilled: step.id < currentStep.value,
    isLast: i === steps.length - 1,
  })),
)
</script>

<template>
  <ol class="flex items-center list-none m-0 px-[120px] py-[24px] bg-surface-l0" aria-label="Progress">
    <li
      v-for="{ step, state, connectorFilled, isLast } in items"
      :key="step.id"
      class="flex items-center"
      :class="isLast ? 'shrink-0' : 'flex-1'"
    >
      <div
        class="flex items-center gap-[10px] shrink-0 cursor-pointer select-none"
        role="button"
        tabindex="0"
        :aria-current="state === 'active' ? 'step' : undefined"
        @click="goToStep(step.id)"
        @keydown.enter.prevent="goToStep(step.id)"
        @keydown.space.prevent="goToStep(step.id)"
      >
        <span
          class="flex items-center justify-center shrink-0 size-[32px] rounded-full text-md font-semibold"
          :class="{
            'bg-brand-emphasis-rest text-inverse': state === 'active' || state === 'completed',
            'bg-surface-l2 text-neutral-quiet': state === 'inactive',
            'bg-danger-emphasis-rest text-inverse': state === 'error',
          }"
        >
          <q-icon v-if="state === 'completed'" name="check" size="18px" />
          <q-icon v-else-if="state === 'error'" name="priority_high" size="18px" />
          <template v-else>{{ step.id }}</template>
        </span>
        <span
          class="text-[13px] leading-normal whitespace-nowrap"
          :class="{
            'text-neutral font-semibold': state === 'active',
            'text-neutral font-medium': state === 'completed',
            'text-neutral-quiet font-normal': state === 'inactive',
            'text-danger font-medium': state === 'error',
          }"
        >
          {{ step.label }}
        </span>
      </div>

      <div v-if="!isLast" class="flex flex-1 items-center px-[16px]" aria-hidden="true">
        <span
          class="flex-1 h-[2px] rounded-[1px]"
          :class="connectorFilled ? 'bg-brand-emphasis-rest' : 'bg-surface-l2'"
        />
      </div>
    </li>
  </ol>
</template>
