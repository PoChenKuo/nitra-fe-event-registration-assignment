<script setup>
import { ref, computed } from 'vue'
import { addons } from '../../mocks/addons.js'
import { sessions } from '../../mocks/sessions.js'
import { useRegistration } from '../../composables/useRegistration.js'
import { formatTimeRange, formatDateLabel } from '../../utils/datetime.js'
import SegmentedTabs from '../../components/SegmentedTabs.vue'
import AddonCard from '../../components/AddonCard.vue'
import MerchCard from '../../components/MerchCard.vue'
import OrderSummary from '../../components/OrderSummary.vue'
import ShippingBanner from '../../components/ShippingBanner.vue'

const reg = useRegistration()

const categories = [
  { key: 'workshop', label: 'Workshops' },
  { key: 'meal', label: 'Meal Packages' },
  { key: 'merchandise', label: 'Merchandise' },
]
const activeCategory = ref('workshop')

const workshops = addons.filter((a) => a.category === 'workshop')
const meals = addons.filter((a) => a.category === 'meal')
const merchandise = addons.filter((a) => a.category === 'merchandise')

// Time ranges of the sessions selected in Step 2 — used to flag workshop conflicts.
const selectedSessionRanges = computed(() =>
  sessions
    .filter((s) => reg.selectedSessionIds.value.includes(s.id))
    .map((s) => [+new Date(s.date), +new Date(s.endDate)]),
)
function hasSessionConflict(ws) {
  const start = +new Date(ws.date)
  const end = +new Date(ws.endDate)
  return selectedSessionRanges.value.some(([s, e]) => start < e && s < end)
}

// Per-spec: a workshop that is full OR overlaps a selected session is unavailable.
function workshopProps(ws) {
  const full = ws.registered >= ws.capacity
  const conflict = !full && hasSessionConflict(ws)
  const remaining = Math.max(0, ws.capacity - ws.registered)
  let status
  if (full) status = { text: 'Sold Out', tone: 'quiet' }
  else if (conflict) status = { text: 'Unavailable — conflicts with a selected session', tone: 'danger' }
  else status = { text: `${remaining} spots remaining`, tone: 'quiet' }
  return {
    disabled: full || conflict,
    status,
    timeText: `${formatDateLabel(ws.date)}, ${formatTimeRange(ws.date, ws.endDate)}`,
  }
}

// Shown whenever the cart contains merchandise — independent of the active tab
// (the shipping notice applies to the whole add-ons page, per spec).
const showBanner = computed(() => reg.hasMerchandise.value)
</script>

<template>
  <section class="flex flex-col gap-[24px]">
    <h2 class="text-h3 text-neutral">Select Add-ons</h2>

    <div class="flex flex-col lg:flex-row gap-[32px] items-start">
      <!-- List column -->
      <div class="flex-1 min-w-0 w-full flex flex-col gap-[16px]">
        <SegmentedTabs v-model="activeCategory" :items="categories" />
        <ShippingBanner v-if="showBanner" />

        <template v-if="activeCategory === 'workshop'">
          <AddonCard
            v-for="w in workshops"
            :key="w.id"
            :addon="w"
            :selected="reg.workshopIds.value.includes(w.id)"
            v-bind="workshopProps(w)"
            @toggle="reg.toggleWorkshop"
          />
        </template>

        <template v-else-if="activeCategory === 'meal'">
          <AddonCard
            v-for="m in meals"
            :key="m.id"
            :addon="m"
            :selected="reg.mealIds.value.includes(m.id)"
            @toggle="reg.toggleMeal"
          />
        </template>

        <template v-else>
          <MerchCard
            v-for="p in merchandise"
            :key="p.id"
            :addon="p"
            :qty="reg.merchQty(p.id)"
            :size="reg.merchSize(p.id)"
            @update:qty="(q) => reg.setMerchQty(p.id, q)"
            @update:size="(s) => reg.setMerchSize(p.id, s)"
          />
        </template>
      </div>

      <!-- Summary column -->
      <OrderSummary class="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-[16px]" />
    </div>
  </section>
</template>
