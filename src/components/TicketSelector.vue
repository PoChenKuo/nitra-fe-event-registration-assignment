<script setup>
import { ref, watch } from 'vue'
import { event } from '../mocks/event.js'
import { useRegistration } from '../composables/useRegistration.js'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import TicketCard from './TicketCard.vue'

const { ticketTypeId } = useRegistration()
const tickets = event.ticketTypes

// Below 960px the three cards become a swipeable, scroll-snapping carousel.
const isNarrow = useMediaQuery('(max-width: 959px)')

// Carousel active slide model, defaults to the selected ticket or the first ticket.
const carouselSlide = ref(ticketTypeId.value || tickets[0]?.id)

// Keep carousel slide in sync when ticketTypeId changes externally
watch(() => ticketTypeId.value, (newVal) => {
  if (newVal && newVal !== carouselSlide.value) {
    carouselSlide.value = newVal
  }
})


function select(id) {
  ticketTypeId.value = id
}
</script>

<template>
  <section class="flex flex-col gap-[16px]">
    <h3 class="text-subtitle1 text-neutral mt-0 mb-0">Select Ticket Type</h3>

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

    <!-- Narrow: Quasar Carousel -->
    <q-carousel
      v-else
      v-model="carouselSlide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      arrows
      height="380px"
      class="bg-transparent"
    >
      <q-carousel-slide
        v-for="t in tickets"
        :key="t.id"
        :name="t.id"
        class="q-pa-none bg-transparent flex justify-center items-center px-[48px] pb-[40px] pt-[8px]"
      >
        <TicketCard
          :ticket="t"
          :selected="ticketTypeId === t.id"
          class="w-full h-full max-w-[400px] mx-auto"
          @select="select"
        />
      </q-carousel-slide>
    </q-carousel>
  </section>
</template>
