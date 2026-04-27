<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useDarkMode } from '@/composables/useDarkMode'
import { useFilters } from '@/composables/useFilters'

const emit = defineEmits<{
  'open-login': []
}>()

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const { isDark, toggle: toggleDark } = useDarkMode()
const { searchQuery, setSearch, clearSearch } = useFilters()

const searchInput = ref(searchQuery.value)
const mobileSearchOpen = ref(false)

function handleSearch(): void {
  setSearch(searchInput.value)
  // Navigate home if not already there
  if (router.currentRoute.value.name !== 'Home') {
    router.push('/')
  }
}

function handleClear(): void {
  searchInput.value = ''
  clearSearch()
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  searchInput.value = target.value
  setSearch(target.value)
}

function openCart(): void {
  cartStore.openDrawer()
}

const cartBadgeVisible = computed(() => cartStore.totalItems > 0)
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/95"
  >
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center gap-4">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex shrink-0 items-center gap-2 text-primary-600 dark:text-primary-400"
        >
          <svg class="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" class="fill-primary-100 dark:fill-primary-900" />
            <path
              d="M8 10h2l2.5 8h9l1.5-5H11"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="14" cy="21" r="1.5" fill="currentColor" />
            <circle cx="20" cy="21" r="1.5" fill="currentColor" />
            <path
              d="M19 7c-2 0-3 1.5-3 3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M22 8c-1-1-2.5-1-3.5 0"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <span class="hidden text-xl font-bold sm:block">
            Fresh<span class="text-gray-900 dark:text-white">Mart</span>
          </span>
        </RouterLink>

        <!-- Desktop Search -->
        <div class="relative hidden flex-1 max-w-xl md:block">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            :value="searchInput"
            placeholder="Search groceries, snacks, beverages…"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-500 dark:focus:bg-gray-700"
            @input="handleInput"
            @keyup.enter="handleSearch"
          />
          <button
            v-if="searchInput"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
            @click="handleClear"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Right Actions -->
        <div class="ml-auto flex items-center gap-1 sm:gap-2">
          <!-- Mobile search toggle -->
          <button
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 md:hidden"
            aria-label="Toggle search"
            @click="mobileSearchOpen = !mobileSearchOpen"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </button>

          <!-- Dark Mode Toggle -->
          <button
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleDark"
          >
            <!-- Sun icon (shown in dark mode) -->
            <svg
              v-if="isDark"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
              />
            </svg>
            <!-- Moon icon (shown in light mode) -->
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z"
              />
            </svg>
          </button>

          <!-- Auth Button -->
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-2">
              <img
                v-if="authStore.user?.image"
                :src="authStore.user.image"
                :alt="authStore.displayName"
                class="hidden h-8 w-8 rounded-full object-cover ring-2 ring-primary-400 sm:block"
              />
              <button
                class="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:block"
                @click="authStore.logout"
              >
                Sign out
              </button>
              <button
                class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 sm:hidden dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Sign out"
                @click="authStore.logout"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </template>
          <button
            v-else
            class="hidden rounded-lg px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/30 sm:block"
            @click="emit('open-login')"
          >
            Sign In
          </button>
          <button
            v-if="!authStore.isAuthenticated"
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 sm:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Sign in"
            @click="emit('open-login')"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          <!-- Cart Button -->
          <button
            class="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Open cart"
            @click="openCart"
          >
            <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.4A1 1 0 007.6 20h8.8a1 1 0 00.97-1.24L16 13M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <transition
              enter-active-class="transition-all duration-200"
              enter-from-class="scale-0 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition-all duration-150"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-0 opacity-0"
            >
              <span
                v-if="cartBadgeVisible"
                class="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white dark:bg-primary-500"
              >
                {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
              </span>
            </transition>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div v-if="mobileSearchOpen" class="pb-3 md:hidden">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              :value="searchInput"
              placeholder="Search products…"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-500"
              autofocus
              @input="handleInput"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>
