<script setup>
import { useWizard } from '../composables/useWizard.js'
import { useSubmission } from '../composables/useSubmission.js'

const { currentMeta, isFirst, isLast, goNext, goBack } = useWizard()
const { canSubmit, submit } = useSubmission()

function onPrimary() {
  if (isLast.value) submit()
  else goNext()
}
</script>

<template>
  <div class="flex items-center justify-between h-[72px] px-[120px] bg-surface-l0">
    <q-btn
      v-if="!isFirst"
      unelevated
      no-caps
      label="Back"
      class="text-md font-semibold px-[16px]"
      style="border-radius: var(--border-radius-default, 0.625rem); background: var(--components-button-secondary-bg-muted-rest, #E3E6E8); color: var(--components-button-secondary-text-on-muted, rgba(0, 0, 0, 0.6));"
      @click="goBack"
    />
    <span v-else />

    <q-btn
      unelevated
      no-caps
      color="accent"
      :label="currentMeta.nextLabel"
      :disable="isLast && !canSubmit"
      class="rounded-[10px] text-md font-semibold px-[16px]"
      @click="onPrimary"
    />
  </div>
</template>
