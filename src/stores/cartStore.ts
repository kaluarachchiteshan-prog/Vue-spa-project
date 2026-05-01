import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { CartItem, Product } from '@/types'

const CART_STORAGE_KEY = 'freshmart_cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isDrawerOpen = ref(false)

  /** Restore cart from localStorage on app boot */
  function init(): void {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        items.value = JSON.parse(stored) as CartItem[]
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
  }

  /** Persist cart to localStorage whenever it changes */
  watch(
    items,
    (newItems) => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
    },
    { deep: true },
  )

  // ─── Computed ───────────────────────────────────────────────────────────────

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  const isEmpty = computed(() => items.value.length === 0)

  // ─── Actions ────────────────────────────────────────────────────────────────

  function addToCart(product: Product): void {
    const existing = items.value.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  function removeFromCart(productId: number): void {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  function incrementQuantity(productId: number): void {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) item.quantity++
  }

  function decrementQuantity(productId: number): void {
    const item = items.value.find((item) => item.product.id === productId)
    if (!item) return
    if (item.quantity <= 1) {
      removeFromCart(productId)
    } else {
      item.quantity--
    }
  }

  function clearCart(): void {
    items.value = []
  }

  function isInCart(productId: number): boolean {
    return items.value.some((item) => item.product.id === productId)
  }

  function getQuantity(productId: number): number {
    return items.value.find((item) => item.product.id === productId)?.quantity ?? 0
  }

  function openDrawer(): void {
    isDrawerOpen.value = true
  }

  function closeDrawer(): void {
    isDrawerOpen.value = false
  }

  return {
    items,
    isDrawerOpen,
    totalItems,
    totalPrice,
    isEmpty,
    init,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isInCart,
    getQuantity,
    openDrawer,
    closeDrawer,
  }
})
