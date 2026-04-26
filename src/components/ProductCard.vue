<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import StarRating from '@/components/StarRating.vue'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const cartStore = useCartStore()

const imgError = ref(false)
const addedFeedback = ref(false)

const discountedPrice = computed(() =>
  props.product.price * (1 - props.product.discountPercentage / 100),
)

const stockLabel = computed(() => {
  if (props.product.stock === 0) return 'Out of Stock'
  if (props.product.stock < 5) return `Only ${props.product.stock} left`
  return null
})

function handleAddToCart(event: MouseEvent): void {
  event.stopPropagation()
  cartStore.addToCart(props.product)
  addedFeedback.value = true
  setTimeout(() => {
    addedFeedback.value = false
  }, 1500)
}

function goToProduct(): void {
  router.push({ name: 'Product', params: { id: props.product.id } })
}
</script>

<template>
  <article
    class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 hover:dark:border-gray-600"
    role="button"
    tabindex="0"
    :aria-label="`View ${product.title}`"
    @click="goToProduct"
    @keyup.enter="goToProduct"
  >
    <!-- Image Container -->
    <div class="relative overflow-hidden bg-gray-50 dark:bg-gray-700">
      <img
        v-if="!imgError"
        :src="product.thumbnail"
        :alt="product.title"
        class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @error="imgError = true"
      />
      <!-- Fallback image -->
      <div
        v-else
        class="flex h-48 w-full items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <svg
          class="h-16 w-16 text-gray-300 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Discount Badge -->
      <div
        v-if="product.discountPercentage >= 5"
        class="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>

      <!-- In-cart indicator -->
      <div
        v-if="cartStore.isInCart(product.id)"
        class="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- Card Body -->
    <div class="flex flex-1 flex-col p-4">
      <!-- Category -->
      <span class="mb-1 text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
        {{ product.category }}
      </span>

      <!-- Title -->
      <h3 class="mb-1 line-clamp-2 flex-1 text-sm font-semibold leading-snug text-gray-900 dark:text-white">
        {{ product.title }}
      </h3>

      <!-- Rating -->
      <div class="mb-3 flex items-center gap-1.5">
        <StarRating :rating="product.rating" size="sm" />
        <span class="text-xs text-gray-500 dark:text-gray-400">({{ product.rating.toFixed(1) }})</span>
      </div>

      <!-- Price Row -->
      <div class="mb-3 flex items-baseline gap-2">
        <span class="text-lg font-bold text-gray-900 dark:text-white">
          ${{ discountedPrice.toFixed(2) }}
        </span>
        <span
          v-if="product.discountPercentage >= 1"
          class="text-sm text-gray-400 line-through dark:text-gray-500"
        >
          ${{ product.price.toFixed(2) }}
        </span>
      </div>

      <!-- Stock warning -->
      <p v-if="stockLabel" class="mb-2 text-xs font-medium text-orange-500 dark:text-orange-400">
        {{ stockLabel }}
      </p>

      <!-- Add to Cart Button -->
      <button
        :disabled="product.stock === 0"
        :class="[
          'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
          product.stock === 0
            ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            : addedFeedback
              ? 'bg-green-500 text-white'
              : cartStore.isInCart(product.id)
                ? 'border border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/30'
                : 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700',
        ]"
        @click.stop="handleAddToCart"
      >
        <template v-if="addedFeedback">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </template>
        <template v-else-if="product.stock === 0">Out of Stock</template>
        <template v-else-if="cartStore.isInCart(product.id)">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add More
        </template>
        <template v-else>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.4A1 1 0 007.6 20h8.8a1 1 0 00.97-1.24L16 13M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          Add to Cart
        </template>
      </button>
    </div>
  </article>
</template>
