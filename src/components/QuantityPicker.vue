<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 99 },
})
const emit = defineEmits(['update:modelValue'])

function dec() {
  if (props.modelValue > props.min) emit('update:modelValue', props.modelValue - 1)
}
function inc() {
  if (props.modelValue < props.max) emit('update:modelValue', props.modelValue + 1)
}
</script>

<template>
  <div class="flex items-center gap-[8px]">
    <button
      type="button"
      class="flex items-center justify-center size-[28px] rounded-[6px] bg-surface-l2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-l3"
      :disabled="modelValue <= min"
      aria-label="Decrease quantity"
      @click="dec"
    >
      <q-icon name="remove" size="16px" class="text-neutral" />
    </button>

    <span class="w-[24px] text-center text-md font-semibold text-neutral">{{ modelValue }}</span>

    <button
      type="button"
      class="flex items-center justify-center size-[28px] rounded-[6px] bg-surface-l2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-l3"
      :disabled="modelValue >= max"
      aria-label="Increase quantity"
      @click="inc"
    >
      <q-icon name="add" size="16px" class="text-neutral" />
    </button>
  </div>
</template>
