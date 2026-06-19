<script setup>
import { useWizard } from '../composables/useWizard.js'

// Task 1: the content area renders the active step. Real step pages are built
// in Tasks 3+; for now this shows a placeholder reflecting wizard navigation.
const { steps, currentStep, currentMeta } = useWizard()
</script>

<template>
  <q-page class="bg-surface-l0">
    <div class="mx-auto max-w-[1440px] px-[120px] py-[40px]">
      <h2 class="text-h3 text-neutral">{{ currentMeta.label }}</h2>
      <p class="text-md text-neutral-muted mt-[8px]">
        Step {{ currentStep }} of {{ steps.length }} — page content arrives in later tasks.
      </p>
    </div>
  </q-page>
</template>
