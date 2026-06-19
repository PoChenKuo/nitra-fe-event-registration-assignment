<script setup>
defineProps({
  ticket: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <div
    class="flex flex-col gap-[12px] p-[20px] rounded-[6px] cursor-pointer select-none transition-colors shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]"
    :class="
      selected
        ? 'bg-brand-muted-rest border-2 border-brand-emphasis'
        : 'bg-surface-l1 border border-neutral-muted'
    "
    role="button"
    tabindex="0"
    :aria-pressed="selected"
    @click="$emit('select', ticket.id)"
    @keydown.enter.prevent="$emit('select', ticket.id)"
    @keydown.space.prevent="$emit('select', ticket.id)"
  >
    <div class="flex items-center justify-between w-full text-subtitle1 text-neutral">
      <span>{{ ticket.name }}</span>
      <span>${{ ticket.price }}</span>
    </div>

    <p class="text-sm text-neutral-muted">{{ ticket.description }}</p>

    <div
      v-for="perk in ticket.perks"
      :key="perk"
      class="flex items-center gap-[8px] w-full"
    >
      <q-icon name="check_circle" size="14px" class="shrink-0 text-neutral" />
      <span class="text-sm text-neutral-muted">{{ perk }}</span>
    </div>

    <span
      v-if="selected"
      class="inline-flex items-center bg-success-bold-rest text-inverse rounded-full px-[9px] py-[3px] text-xs font-medium"
    >
      ✓ Selected
    </span>
  </div>
</template>
