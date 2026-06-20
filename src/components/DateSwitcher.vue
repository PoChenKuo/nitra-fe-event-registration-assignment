<script setup>
defineProps({
  dates: { type: Array, required: true }, // [{ key, label }]
  modelValue: { type: String, default: null },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="inline-flex w-fit gap-[4px] p-[4px] rounded-[10px] bg-surface-l2" role="tablist">
    <div
      v-for="d in dates"
      :key="d.key"
      class="px-[20px] py-[8px] rounded-[8px] text-[13px] cursor-pointer select-none transition-colors"
      :class="
        modelValue === d.key
          ? 'bg-brand-emphasis-rest text-inverse font-semibold'
          : 'text-neutral-muted font-medium'
      "
      role="tab"
      :aria-selected="modelValue === d.key"
      tabindex="0"
      @click="$emit('update:modelValue', d.key)"
      @keydown.enter.prevent="$emit('update:modelValue', d.key)"
      @keydown.space.prevent="$emit('update:modelValue', d.key)"
    >
      {{ d.label }}
    </div>
  </div>
</template>
