<script setup>
import { event } from '../mocks/event.js'
import { useRegistration } from '../composables/useRegistration.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import TicketCard from './TicketCard.vue'

const { ticketTypeId } = useRegistration()
const tickets = event.ticketTypes

// Below 1280px the three cards become a swipeable, scroll-snapping carousel.
const isNarrow = useMediaQuery('(max-width: 1279px)')

function select(id) {
  ticketTypeId.value = id
}
</script>

<template>
  <section class="flex flex-col gap-[16px]">
    <h3 class="text-subtitle1 text-neutral">Select Ticket Type</h3>

    <!-- Wide: equal-height row. `content-start` keeps the (single) flex line
         packed to the top so stretched cards don't gain stray bottom space. -->
    <div v-if="!isNarrow" class="flex gap-[16px] items-stretch [align-content:start]">
      <TicketCard
        v-for="t in tickets"
        :key="t.id"
        :ticket="t"
        :selected="ticketTypeId === t.id"
        class="flex-1 min-w-0"
        @select="select"
      />
    </div>

    <!-- Narrow: swipeable carousel (native scroll-snap) -->
    <div
      v-else
      class="flex gap-[16px] overflow-x-auto scroll-smooth snap-x snap-mandatory pb-[8px] px-[4px] -mx-[4px]"
    >
      <TicketCard
        v-for="t in tickets"
        :key="t.id"
        :ticket="t"
        :selected="ticketTypeId === t.id"
        class="snap-center shrink-0 w-[85%]"
        @select="select"
      />
    </div>
  </section>
</template>
