// Field-format and time-overlap helpers used by the Review-step validation.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

// E.164 international phone format: '+' then a country-code digit (1–9) and up
// to 14 more digits (15 max). Spaces are stripped first, so "+1 555 1234567" is
// accepted; parens / dashes / letters are rejected. e.g. +15551234567
export const isValidE164Phone = (v) => /^\+[1-9]\d{1,14}$/.test(String(v).replace(/ /g, ''))

/** True when two {date, endDate} time ranges overlap. */
export function overlaps(a, b) {
  return +new Date(a.date) < +new Date(b.endDate) && +new Date(b.date) < +new Date(a.endDate)
}
