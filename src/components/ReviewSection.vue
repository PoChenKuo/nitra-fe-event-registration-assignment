<script setup>
import { useWizard } from '../composables/useWizard.js'

defineProps({
  title: { type: String, required: true },
  editStep: { type: Number, required: true },
  error: { type: Boolean, default: false },
})

const { goToStep } = useWizard()
</script>

<template>
  <div
    class="flex flex-col gap-[12px] p-[20px] rounded-[6px] bg-surface-l1 border-solid"
    :class="
      error
        ? 'border-[2px] border-danger-emphasis '
        : 'border border-neutral-muted m-[1px]'
    "
  >
    <div class="flex items-center justify-between w-full">
      <h3 class="text-subtitle1" :class="error ? 'text-danger' : 'text-neutral'">{{ title }}</h3>
      <button
        type="button"
        class="text-sm font-semibold text-brand underline leading-[16px]"
        @click="goToStep(editStep)"
      >
        Edit → Step {{ editStep }}
      </button>
    </div>
    <slot />
  </div>
</template>
