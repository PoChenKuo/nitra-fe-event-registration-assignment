<script setup>
import { computed } from 'vue'
import QuantityPicker from './QuantityPicker.vue'
import SizeSelect from './SizeSelect.vue'

const props = defineProps({
  addon: { type: Object, required: true },
  qty: { type: Number, default: 0 },
  size: { type: String, default: null },
})
defineEmits(['update:qty', 'update:size'])

const selected = computed(() => props.qty > 0)
</script>

<template>
  <div
    class="flex flex-col gap-[8px] p-[16px] rounded-[8px] transition-colors shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]"
    :class="
      selected
        ? 'bg-brand-muted-rest border border-brand-emphasis'
        : 'bg-surface-l0 border border-neutral-muted'
    "
  >
    <div class="flex items-center justify-between w-full text-subtitle1 text-neutral">
      <span>{{ addon.name }}</span>
      <span>${{ addon.price }}</span>
    </div>

    <p class="text-sm text-neutral-muted">{{ addon.description }}</p>

    <div class="flex flex-wrap items-center gap-[16px]">
      <SizeSelect
        v-if="addon.sizes"
        :model-value="size"
        :options="addon.sizes"
        @update:model-value="$emit('update:size', $event)"
      />
      <div class="flex items-center gap-[8px]">
        <span class="text-sm font-medium text-neutral-muted">Qty:</span>
        <QuantityPicker
          :model-value="qty"
          :min="0"
          :max="addon.maxQuantity"
          @update:model-value="$emit('update:qty', $event)"
        />
        <span class="text-[10px] text-neutral-quiet">max {{ addon.maxQuantity }}</span>
      </div>
    </div>

    <p v-if="selected" class="text-xs font-semibold text-success">✓ Added to order</p>
  </div>
</template>
