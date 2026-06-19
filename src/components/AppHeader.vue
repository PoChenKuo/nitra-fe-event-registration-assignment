<script setup>
import { event } from '../mocks/event.js'
import BrandEmblem from './BrandEmblem.vue'
</script>

<template>
  <header class="flex items-center gap-[12px] h-[72px] px-[48px] bg-surface-l0">
    <div
      class="flex items-center justify-center shrink-0 size-[40px] rounded-[8px] bg-brand-emphasis-rest text-inverse"
    >
      <BrandEmblem class="w-[28px] h-[14px]" />
    </div>
    <p class="text-h4 text-neutral whitespace-nowrap">{{ event.name }}</p>
  </header>
</template>
