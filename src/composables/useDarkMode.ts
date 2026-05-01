import { ref, watch, type Ref } from 'vue'

const DARK_MODE_KEY = 'freshmart_dark_mode'

// Module-level singleton so all components share the same state
const isDark: Ref<boolean> = ref(
  localStorage.getItem(DARK_MODE_KEY) === 'true' ||
    (!localStorage.getItem(DARK_MODE_KEY) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches),
)

function applyDarkMode(dark: boolean): void {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply on module load
applyDarkMode(isDark.value)

// Persist changes
watch(isDark, (newVal) => {
  applyDarkMode(newVal)
  localStorage.setItem(DARK_MODE_KEY, String(newVal))
})

export function useDarkMode() {
  function toggle(): void {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
