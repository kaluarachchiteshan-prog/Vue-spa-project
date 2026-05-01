<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import type { CartItem } from '@/types'

const cartStore = useCartStore()

const savingsTotal = computed(() =>
  cartStore.items.reduce((sum, item) => {
    const saving = item.product.price * (item.product.discountPercentage / 100) * item.quantity
    return sum + saving
  }, 0),
)

function getDiscountedPrice(item: CartItem): number {
  return item.product.price * (1 - item.product.discountPercentage / 100)
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
        v-if="cartStore.isDrawerOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        @click="cartStore.closeDrawer"
      />
    </transition>

    <!-- Drawer Panel -->
    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="cartStore.isDrawerOpen"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700"
        >
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Your Cart</h2>
            <span
              v-if="cartStore.totalItems > 0"
              class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white"
            >
              {{ cartStore.totalItems }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="!cartStore.isEmpty"
              class="text-sm font-medium text-red-500 transition hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              @click="cartStore.clearCart"
            >
              Clear all
            </button>
            <button
              class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close cart"
              @click="cartStore.closeDrawer"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="cartStore.isEmpty"
          class="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <svg
              class="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.4A1 1 0 007.6 20h8.8a1 1 0 00.97-1.24L16 13M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">Your cart is empty</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add some fresh groceries to get started!
            </p>
          </div>
          <button
            class="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            @click="cartStore.closeDrawer"
          >
            Browse Products
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="scrollbar-thin flex-1 overflow-y-auto px-5 py-4">
          <ul class="space-y-4">
            <li
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition dark:border-gray-700 dark:bg-gray-800"
            >
              <!-- Product Image -->
              <img
                :src="item.product.thumbnail"
                :alt="item.product.title"
                class="h-16 w-16 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <p class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                  {{ item.product.title }}
                </p>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {{ item.product.category }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    ${{ (getDiscountedPrice(item) * item.quantity).toFixed(2) }}
                  </span>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-1">
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200 text-gray-700 transition hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                      :aria-label="`Decrease quantity of ${item.product.title}`"
                      @click="cartStore.decrementQuantity(item.product.id)"
                    >
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4" />
                      </svg>
                    </button>
                    <span
                      class="w-6 text-center text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ item.quantity }}
                    </span>
                    <button
                      class="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-600 text-white transition hover:bg-primary-700"
                      :aria-label="`Increase quantity of ${item.product.title}`"
                      @click="cartStore.incrementQuantity(item.product.id)"
                    >
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Remove Button -->
              <button
                class="self-start rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                :aria-label="`Remove ${item.product.title} from cart`"
                @click="cartStore.removeFromCart(item.product.id)"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <!-- Order Summary Footer -->
        <div
          v-if="!cartStore.isEmpty"
          class="border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Savings -->
          <div
            v-if="savingsTotal > 0"
            class="mb-3 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20"
          >
            <span class="text-sm font-medium text-green-700 dark:text-green-400">
              🎉 You're saving
            </span>
            <span class="text-sm font-bold text-green-700 dark:text-green-400">
              ${{ savingsTotal.toFixed(2) }}
            </span>
          </div>

          <!-- Totals -->
          <div class="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Subtotal ({{ cartStore.totalItems }} items)</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Delivery</span>
            <span class="font-medium text-primary-600 dark:text-primary-400">Free</span>
          </div>
          <div
            class="mb-4 mt-2 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-600"
          >
            <span class="font-bold text-gray-900 dark:text-white">Total</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white">
              ${{ cartStore.totalPrice.toFixed(2) }}
            </span>
          </div>

          <!-- Checkout Button -->
          <button
            class="w-full rounded-xl bg-primary-600 py-3.5 text-base font-bold text-white shadow-sm shadow-primary-200 transition hover:bg-primary-700 active:scale-[0.98] dark:shadow-primary-900"
            @click="cartStore.closeDrawer"
          >
            Proceed to Checkout
          </button>
          <p class="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
            Secure checkout · Free returns
          </p>
        </div>
      </aside>
    </transition>
  </teleport>
</template>
