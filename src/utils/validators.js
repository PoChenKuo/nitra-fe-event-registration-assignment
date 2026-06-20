// Field-format and time-overlap helpers used by the Review-step validation.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

// Lenient phone check: digits with common separators, at least 7 digits.
export const isPhone = (v) => {
  const s = String(v).trim()
  return /^[+]?[\d\s().-]{7,}$/.test(s) && (s.match(/\d/g)?.length ?? 0) >= 7
}

/** True when two {date, endDate} time ranges overlap. */
export function overlaps(a, b) {
  return +new Date(a.date) < +new Date(b.endDate) && +new Date(b.date) < +new Date(a.endDate)
}
