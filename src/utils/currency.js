// Currency formatting — $X,XXX.XX (USD).
const FMT = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatCurrency(amount) {
  return FMT.format(amount)
}
