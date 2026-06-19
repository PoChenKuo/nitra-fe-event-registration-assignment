<script setup>
import { useWizard } from '../composables/useWizard.js'

// NOTE (Task 1): minimal, functional placeholder that reserves the stepper
// region and reflects the current step. Task 2 replaces this with the polished
// component matching the Figma active / completed / inactive states.
const { steps, currentStep, goToStep } = useWizard()
</script>

<template>
  <nav class="h-[80px] px-[120px] flex items-center bg-surface-l0" aria-label="Progress">
    <ol class="flex items-center w-full">
      <li
        v-for="(step, i) in steps"
        :key="step.id"
        class="flex items-center"
        :class="i < steps.length - 1 ? 'flex-1' : 'shrink-0'"
      >
        <button
          type="button"
          class="flex items-center gap-[10px] shrink-0"
          @click="goToStep(step.id)"
        >
          <span
            class="flex items-center justify-center size-[32px] rounded-full text-sm font-semibold transition-colors"
            :class="
              step.id <= currentStep
                ? 'bg-brand-emphasis-rest text-inverse'
                : 'bg-surface-l2 text-neutral-quiet'
            "
          >
            {{ step.id }}
          </span>
          <span
            class="text-sm whitespace-nowrap"
            :class="step.id === currentStep ? 'text-neutral font-semibold' : 'text-neutral-muted'"
          >
            {{ step.label }}
          </span>
        </button>
        <span
          v-if="i < steps.length - 1"
          class="flex-1 h-[2px] mx-[16px] rounded-full"
          :class="step.id < currentStep ? 'bg-brand-emphasis-rest' : 'bg-surface-l3'"
        />
      </li>
    </ol>
  </nav>
</template>
