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
      flat
      no-caps
      icon="arrow_back"
      label="Back"
      class="text-neutral-muted text-md font-semibold"
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
