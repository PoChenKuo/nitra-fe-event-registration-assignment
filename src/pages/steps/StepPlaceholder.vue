<script setup>
import { useWizard } from '../../composables/useWizard.js'

const { steps, currentStep, currentMeta } = useWizard()
</script>

<template>
  <div>
    <h2 class="text-h3 text-neutral">{{ currentMeta.label }}</h2>
    <p class="text-md text-neutral-muted mt-[8px]">
      Step {{ currentStep }} of {{ steps.length }} — page content arrives in a later task.
    </p>
  </div>
</template>
