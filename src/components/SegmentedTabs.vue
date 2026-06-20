<script setup>
defineProps({
  items: { type: Array, required: true }, // [{ key, label }]
  modelValue: { type: String, default: null },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="inline-flex w-fit gap-[4px] p-[4px] rounded-[10px] bg-surface-l2" role="tablist">
    <div
      v-for="it in items"
      :key="it.key"
      class="px-[20px] py-[8px] rounded-[8px] text-[13px] cursor-pointer select-none transition-colors"
      :class="
        modelValue === it.key
          ? 'bg-brand-emphasis-rest text-inverse font-semibold'
          : 'text-neutral-muted font-medium'
      "
      role="tab"
      :aria-selected="modelValue === it.key"
      tabindex="0"
      @click="$emit('update:modelValue', it.key)"
      @keydown.enter.prevent="$emit('update:modelValue', it.key)"
      @keydown.space.prevent="$emit('update:modelValue', it.key)"
    >
      {{ it.label }}
    </div>
  </div>
</template>
