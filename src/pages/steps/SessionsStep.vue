<script setup>
import { ref, computed } from 'vue'
import { sessions } from '../../mocks/sessions.js'
import { useRegistration } from '../../composables/useRegistration.js'
import { formatDateLabel, dateKey } from '../../utils/datetime.js'
import SegmentedTabs from '../../components/SegmentedTabs.vue'
import SessionCard from '../../components/SessionCard.vue'

const { selectedSessionIds, toggleSession, isSessionSelected } = useRegistration()

// Group sessions by day, preserving order of first appearance.
const groups = computed(() => {
  const map = new Map()
  for (const s of sessions) {
    const key = dateKey(s.date)
    if (!map.has(key)) map.set(key, { key, label: formatDateLabel(s.date), sessions: [] })
    map.get(key).sessions.push(s)
  }
  return [...map.values()]
})
const dates = computed(() => groups.value.map((g) => ({ key: g.key, label: g.label })))

const activeDate = ref(dateKey(sessions[0].date))
const visibleSessions = computed(
  () => groups.value.find((g) => g.key === activeDate.value)?.sessions ?? [],
)

const hint = computed(() => {
  const n = selectedSessionIds.value.length
  return `${n} session${n === 1 ? '' : 's'} selected`
})
</script>

<template>
  <section class="flex flex-col gap-[24px]">
    <h2 class="text-h3 text-neutral mt-0 mb-0">Select Sessions</h2>

    <div class="flex flex-col gap-[16px]">
      <SegmentedTabs v-model="activeDate" :items="dates" />
      <p class="text-sm text-neutral-muted">{{ hint }}</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        <SessionCard
          v-for="s in visibleSessions"
          :key="s.id"
          :session="s"
          :selected="isSessionSelected(s.id)"
          @toggle="toggleSession"
        />
      </div>
    </div>
  </section>
</template>
