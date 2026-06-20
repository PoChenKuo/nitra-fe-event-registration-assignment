import { computed } from 'vue'
import { event } from '../mocks/event.js'
import { addons } from '../mocks/addons.js'
import { useRegistration } from './useRegistration.js'

const WORKSHOP_DISCOUNT_RATE = 0.1 // VIP: 10% off workshops

/**
 * Derives the live order summary (line items, VIP workshop discount, total)
 * from the registration store + mocks. Shared by the Add-ons and Review steps.
 */
export function useOrderSummary() {
  const reg = useRegistration()
  const addonById = (id) => addons.find((a) => a.id === id)

  const ticket = computed(
    () => event.ticketTypes.find((t) => t.id === reg.ticketTypeId.value) ?? null,
  )
  const isVip = computed(() => reg.ticketTypeId.value === 'vip')

  const workshopItems = computed(() => reg.workshopIds.value.map(addonById).filter(Boolean))
  const mealItems = computed(() => reg.mealIds.value.map(addonById).filter(Boolean))
  const merchItems = computed(() =>
    Object.entries(reg.merch)
      .map(([id, v]) => ({ addon: addonById(id), qty: v.qty, size: v.size }))
      .filter((x) => x.addon && x.qty > 0),
  )

  const workshopSubtotal = computed(() =>
    workshopItems.value.reduce((sum, w) => sum + w.price, 0),
  )
  const workshopDiscount = computed(() =>
    isVip.value ? workshopSubtotal.value * WORKSHOP_DISCOUNT_RATE : 0,
  )

  // Add-on line items only — the ticket is shown as its own anchored row so the
  // summary always leads with ticket info even before one is chosen.
  const lines = computed(() => {
    const out = []
    for (const w of workshopItems.value) out.push({ label: w.name, amount: w.price })
    for (const m of mealItems.value) out.push({ label: m.name, amount: m.price })
    for (const x of merchItems.value) {
      out.push({ label: `${x.addon.name} × ${x.qty}`, amount: x.addon.price * x.qty })
    }
    return out
  })

  const total = computed(() => {
    const ticketPrice = ticket.value?.price ?? 0
    const addonsTotal = lines.value.reduce((sum, l) => sum + l.amount, 0)
    return ticketPrice + addonsTotal - workshopDiscount.value
  })

  return { ticket, isVip, workshopItems, mealItems, merchItems, lines, workshopDiscount, total }
}
