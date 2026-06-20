<script setup>
defineProps({
  modelValue: { type: String, default: null },
  options: { type: Array, required: true },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center gap-[8px]">
    <span class="text-sm font-medium text-neutral-muted">Size:</span>
    <div
      class="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] bg-surface-l0 border border-neutral-muted cursor-pointer select-none"
      role="button"
      tabindex="0"
    >
      <span class="text-sm font-medium" :class="modelValue ? 'text-neutral' : 'text-neutral-quiet'">
        {{ modelValue || 'Select' }}
      </span>
      <span class="text-[10px] text-neutral-quiet leading-none">▾</span>

      <q-menu auto-close anchor="bottom left" self="top left">
        <q-list dense style="min-width: 88px">
          <q-item
            v-for="o in options"
            :key="o"
            v-close-popup
            clickable
            :active="o === modelValue"
            @click="$emit('update:modelValue', o)"
          >
            <q-item-section>{{ o }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>
