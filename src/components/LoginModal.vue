<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const credentials = ref<LoginCredentials>({
  username: '',
  password: '',
})

const showPassword = ref(false)

// Reset form and errors whenever modal opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      credentials.value = { username: '', password: '' }
      authStore.clearError()
    }
  },
)

async function handleLogin(): Promise<void> {
  if (!credentials.value.username || !credentials.value.password) return
  try {
    await authStore.login(credentials.value)
    emit('close')
  } catch {
    // error is already set in the store
  }
}

function fillDemo(): void {
  credentials.value = { username: 'freshmart', password: 'FreshMart1@' }
}
</script>

<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emit('close')"
        />

        <!-- Modal Card -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isOpen"
            class="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900"
          >
            <!-- Close Button -->
            <button
              class="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header -->
            <div class="mb-6 text-center">
              <div
                class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30"
              >
                <svg
                  class="h-7 w-7 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in to your FreshMart account</p>
            </div>

            <!-- Demo Hint -->
            <button
              class="mb-5 flex w-full items-center gap-3 rounded-xl border border-dashed border-primary-300 bg-primary-50/50 px-4 py-3 text-left transition hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-900/10 dark:hover:bg-primary-900/20"
              type="button"
              @click="fillDemo"
            >
              <span class="text-xl">💡</span>
              <div>
                <p class="text-xs font-semibold text-primary-700 dark:text-primary-400">
                  Try demo credentials
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Username: <strong>freshmart</strong> · Password: <strong>FreshMart1@</strong>
                </p>
              </div>
            </button>

            <!-- Error Message -->
            <transition
              enter-active-class="transition-all duration-200"
              enter-from-class="-translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
            >
              <div
                v-if="authStore.error"
                class="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
              >
                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ authStore.error }}
              </div>
            </transition>

            <!-- Form -->
            <div class="space-y-4">
              <!-- Username -->
              <div>
                <label
                  for="username"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  v-model="credentials.username"
                  type="text"
                  placeholder="Enter your username"
                  autocomplete="username"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-500 dark:focus:bg-gray-700"
                  @keyup.enter="handleLogin"
                />
              </div>

              <!-- Password -->
              <div>
                <label
                  for="password"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="credentials.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-400/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-500 dark:focus:bg-gray-700"
                    @keyup.enter="handleLogin"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <svg
                      v-if="showPassword"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Submit -->
              <button
                :disabled="authStore.loading || !credentials.username || !credentials.password"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                type="button"
                @click="handleLogin"
              >
                <span
                  v-if="authStore.loading"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"
                />
                {{ authStore.loading ? 'Signing in…' : 'Sign In' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>
