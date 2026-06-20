// Session timestamps are ISO strings in UTC (…Z). The design shows the wall
// time as authored (09:00Z → "9:00 AM"), so we format in UTC to avoid the
// viewer's local timezone shifting the displayed times.

const TIME_OPTS = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }
const DATE_OPTS = { month: 'short', day: 'numeric', timeZone: 'UTC' }

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', TIME_OPTS)
}

export function formatTimeRange(startISO, endISO) {
  return `${formatTime(startISO)} – ${formatTime(endISO)}`
}

export function formatDateLabel(iso) {
  return new Date(iso).toLocaleDateString('en-US', DATE_OPTS)
}

/** Date portion (YYYY-MM-DD) used as a grouping key. */
export function dateKey(iso) {
  return iso.slice(0, 10)
}
