import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Reactive `window.matchMedia` wrapper.
 * @param {string} query - e.g. '(max-width: 1279px)'
 * @returns {import('vue').Ref<boolean>} matches
 */
export function useMediaQuery(query) {
  const matches = ref(false)
  let mql = null
  const update = () => {
    matches.value = mql ? mql.matches : false
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    mql = window.matchMedia(query)
    update()
    mql.addEventListener('change', update)
  })
  onBeforeUnmount(() => {
    if (mql) mql.removeEventListener('change', update)
  })

  return matches
}
