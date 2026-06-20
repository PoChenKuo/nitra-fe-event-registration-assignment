<script setup>
const props = defineProps({
  addon: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  timeText: { type: String, default: null },
  // { text, tone: 'quiet' | 'danger' }
  status: { type: Object, default: null },
})
const emit = defineEmits(['toggle'])

function onToggle() {
  if (!props.disabled) emit('toggle', props.addon.id)
}
</script>

<template>
  <div
    class="flex flex-col gap-[8px] p-[16px] rounded-[6px] border-solid transition-colors shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]"
    :class="
      disabled
        ? 'bg-surface-l0 border border-neutral-muted m-[1px] cursor-not-allowed'
        : selected
          ? 'bg-brand-muted-rest border-[2px] border-brand-emphasis cursor-pointer'
          : 'bg-surface-l0 border border-neutral-muted m-[1px] cursor-pointer'
    "
    role="checkbox"
    :aria-checked="selected"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="onToggle"
    @keydown.enter.prevent="onToggle"
    @keydown.space.prevent="onToggle"
  >
    <div class="flex items-center justify-between w-full text-subtitle1">
      <span class="text-neutral">{{ addon.name }}</span>
      <span class="text-brand-emphasis">${{ addon.price }}</span>
    </div>

    <p class="text-sm text-neutral-muted">{{ addon.description }}</p>
    <p v-if="timeText" class="text-xs text-neutral-quiet">{{ timeText }}</p>
    <p
      v-if="status"
      class="text-xs"
      :class="status.tone === 'danger' ? 'text-danger' : 'text-neutral-quiet'"
    >
      {{ status.text }}
    </p>
  </div>
</template>
