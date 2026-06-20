<script setup>
import { computed } from 'vue'
import { formatTimeRange } from '../utils/datetime.js'

const props = defineProps({
  session: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

// Track → badge colours (Figma raw scale refs).
const TRACK_BADGE = {
  main: 'bg-gray-50 text-gray-700',
  frontend: 'bg-yellow-200 text-yellow-900',
  backend: 'bg-blue-50 text-blue-600',
  devops: 'bg-orange-50 text-orange-600',
}

const isFull = computed(() => props.session.registered >= props.session.capacity)
const remaining = computed(() => Math.max(0, props.session.capacity - props.session.registered))
const fillPct = computed(() =>
  Math.min(100, Math.round((props.session.registered / props.session.capacity) * 100)),
)
const ratio = computed(() => props.session.registered / props.session.capacity)

// Capacity bar + spots text colour by fullness (matches the Figma examples).
const tone = computed(() => {
  if (isFull.value) return { fill: 'bg-red-500', text: 'text-danger' }
  if (ratio.value >= 0.75) return { fill: 'bg-orange-600', text: 'text-orange-700' }
  if (ratio.value >= 0.5) return { fill: 'bg-yellow-800', text: 'text-warning' }
  return { fill: 'bg-brand-emphasis-rest', text: 'text-brand-emphasis' }
})

const badgeClass = computed(() => TRACK_BADGE[props.session.track] ?? TRACK_BADGE.main)
const spotsText = computed(() => (isFull.value ? 'Sold Out' : `${remaining.value} spots left`))
const timeRange = computed(() => formatTimeRange(props.session.date, props.session.endDate))

const cardClass = computed(() => {
  if (isFull.value) return 'bg-surface-l2 border border-neutral-muted m-[1px] cursor-not-allowed'
  if (props.selected) return 'bg-brand-muted-rest border-[2px] border-brand-emphasis cursor-pointer'
  return 'bg-surface-l0 border border-neutral-muted m-[1px] cursor-pointer'
})

function onToggle() {
  if (!isFull.value) emit('toggle', props.session.id)
}
</script>

<template>
  <div
    class="flex flex-col gap-[8px] p-[16px] rounded-[6px] border-solid transition-colors shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]"
    :class="cardClass"
    role="checkbox"
    :aria-checked="selected"
    :aria-disabled="isFull"
    :tabindex="isFull ? -1 : 0"
    @click="onToggle"
    @keydown.enter.prevent="onToggle"
    @keydown.space.prevent="onToggle"
  >
    <!-- Top: track badge + checkbox -->
    <div class="flex items-center justify-between w-full">
      <span
        class="inline-flex items-center rounded-full px-[9px] py-[3px] text-xs font-medium"
        :class="badgeClass"
      >
        {{ session.track.toUpperCase() }}
      </span>

      <span
        v-if="!isFull"
        class="shrink-0 flex items-center justify-center size-[16px] rounded-[2px]"
        :class="selected ? 'bg-brand-emphasis-rest' : 'bg-surface-l0 border border-neutral-emphasis'"
      >
        <q-icon v-if="selected" name="check" size="12px" class="text-inverse" />
      </span>
    </div>

    <p class="m-0 text-subtitle1" :class="isFull ? 'text-neutral-disabled' : 'text-neutral'">
      {{ session.title }}
    </p>
    <p class="m-0 text-sm" :class="isFull ? 'text-neutral-disabled' : 'text-neutral-muted'">
      {{ session.speaker }}, {{ session.speakerTitle }}
    </p>
    <p class="m-0 text-xs" :class="isFull ? 'text-neutral-disabled' : 'text-neutral-quiet'">
      {{ timeRange }}
    </p>

    <!-- Capacity bar -->
    <div class="relative w-full h-[6px] rounded-[3px] bg-surface-l2 overflow-hidden">
      <div
        class="absolute left-0 top-0 h-full rounded-[3px]"
        :class="tone.fill"
        :style="{ width: fillPct + '%' }"
      />
    </div>

    <p class="m-0 text-xs font-medium" :class="tone.text">{{ spotsText }}</p>
  </div>
</template>
