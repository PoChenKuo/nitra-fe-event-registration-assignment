<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String, default: 'text' },
  // Conditional status (per Figma "Shipping Address — Conditional States"):
  required: { type: Boolean, default: false }, // appends " *", emphasis border
  error: { type: Boolean, default: false }, // red label + border + message
  errorMessage: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-col gap-[6px] min-w-0">
    <label class="text-sm font-medium" :class="error ? 'text-danger' : 'text-neutral'">
      {{ label }}<span v-if="required"> *</span>
    </label>
    <q-input
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :error="error"
      :error-message="errorMessage"
      outlined
      dense
      hide-bottom-space
      no-error-icon
      class="attendee-input"
      :class="{ 'attendee-input--required': required && !error }"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>
