<script setup>
import { useOrderSummary } from '../composables/useOrderSummary.js'
import { formatCurrency } from '../utils/currency.js'

const { ticket, lines, workshopDiscount, total } = useOrderSummary()
</script>

<template>
  <aside class="flex flex-col gap-[16px] p-[24px] rounded-[6px] bg-surface-l1 border border-neutral-muted">
    <h3 class="text-subtitle1 text-neutral mt-0 mb-0">Order Summary</h3>

    <!-- Ticket is always shown as the anchor row -->
    <div
      class="flex items-start justify-between w-full text-sm"
      :class="ticket ? 'text-neutral-muted' : 'text-neutral-quiet'"
    >
      <span>{{ ticket ? `${ticket.name} Ticket` : 'No ticket selected' }}</span>
      <span class="shrink-0 pl-[12px]">{{ ticket ? formatCurrency(ticket.price) : '—' }}</span>
    </div>

    <div
      v-for="(line, i) in lines"
      :key="i"
      class="flex items-start justify-between w-full text-sm text-neutral-muted"
    >
      <span>{{ line.label }}</span>
      <span class="shrink-0 pl-[12px]">{{ formatCurrency(line.amount) }}</span>
    </div>

    <div
      v-if="workshopDiscount > 0"
      class="flex items-start justify-between w-full text-xs text-brand-emphasis"
    >
      <span>Workshop discount (VIP 10%)</span>
      <span class="shrink-0 pl-[12px]">{{ formatCurrency(-workshopDiscount) }}</span>
    </div>

    <div class="h-px w-full bg-[var(--divider-muted)]" />

    <div class="flex items-start justify-between w-full text-sm font-medium text-neutral">
      <span>Total</span>
      <span class="shrink-0 pl-[12px]">{{ formatCurrency(total) }}</span>
    </div>
  </aside>
</template>
