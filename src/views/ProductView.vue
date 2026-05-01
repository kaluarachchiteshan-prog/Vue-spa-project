<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProduct } from '@/composables/useProducts'
import { useCartStore } from '@/stores/cartStore'
import StarRating from '@/components/StarRating.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Review } from '@/types'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const cartStore = useCartStore()
const { product, loading, error, fetchProduct } = useProduct()

const selectedImage = ref(0)
const quantity = ref(1)
const addedFeedback = ref(false)

// Numeric product ID derived from the route param
const productId = computed(() => parseInt(props.id, 10))

onMounted(() => {
  fetchProduct(productId.value)
})

// Re-fetch if the route param changes (e.g. navigating between products)
watch(productId, (newId) => {
  fetchProduct(newId)
  selectedImage.value = 0
  quantity.value = 1
})

const discountedPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price * (1 - product.value.discountPercentage / 100)
})

const savings = computed(() => {
  if (!product.value) return 0
  return product.value.price - discountedPrice.value
})

function handleAddToCart(): void {
  if (!product.value) return
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(product.value)
  }
  addedFeedback.value = true
  setTimeout(() => {
    addedFeedback.value = false
  }, 2000)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ratingColor(rating: number): string {
  if (rating >= 4) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
  if (rating >= 3) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
  return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
}

function averageReviewRating(reviews: Review[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Back Button -->
    <button
      class="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      @click="router.back()"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
      <LoadingSpinner size="lg" />
      <p class="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading product…</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-800 dark:bg-red-900/20"
    >
      <div class="mb-4 text-5xl">⚠️</div>
      <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Product Not Found</h3>
      <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
      <button
        class="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        @click="router.push('/')"
      >
        Go Home
      </button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="space-y-10">
      <!-- Top Section: Image + Info -->
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Image Gallery -->
        <div class="space-y-3">
          <!-- Main Image -->
          <div
            class="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          >
            <img
              :src="product.images[selectedImage] ?? product.thumbnail"
              :alt="`${product.title} – image ${selectedImage + 1}`"
              class="h-72 w-full object-contain p-4 transition-opacity duration-200 sm:h-96"
            />
          </div>

          <!-- Thumbnail Strip -->
          <div v-if="product.images.length > 1" class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              :class="[
                'shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200',
                selectedImage === idx
                  ? 'border-primary-500 ring-2 ring-primary-400/30'
                  : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500',
              ]"
              :aria-label="`View image ${idx + 1}`"
              @click="selectedImage = idx"
            >
              <img
                :src="img"
                :alt="`Thumbnail ${idx + 1}`"
                class="h-16 w-16 object-cover sm:h-20 sm:w-20"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <!-- Category + Tags -->
          <div class="mb-3 flex flex-wrap gap-2">
            <span
              class="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
            >
              {{ product.category }}
            </span>
            <span
              v-for="tag in product.tags?.slice(0, 3)"
              :key="tag"
              class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="mb-2 text-2xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-3xl">
            {{ product.title }}
          </h1>

          <!-- Brand -->
          <p v-if="product.brand" class="mb-3 text-sm text-gray-500 dark:text-gray-400">
            by <span class="font-semibold text-gray-700 dark:text-gray-300">{{ product.brand }}</span>
          </p>

          <!-- Rating Row -->
          <div class="mb-4 flex items-center gap-3">
            <StarRating :rating="product.rating" show-value />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              ({{ product.reviews?.length ?? 0 }} reviews)
            </span>
          </div>

          <!-- Price Block -->
          <div class="mb-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
            <div class="flex items-end gap-3">
              <span class="text-3xl font-extrabold text-gray-900 dark:text-white">
                ${{ discountedPrice.toFixed(2) }}
              </span>
              <span
                v-if="product.discountPercentage >= 1"
                class="mb-1 text-lg text-gray-400 line-through dark:text-gray-500"
              >
                ${{ product.price.toFixed(2) }}
              </span>
              <span
                v-if="product.discountPercentage >= 5"
                class="mb-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
              >
                -{{ Math.round(product.discountPercentage) }}%
              </span>
            </div>
            <p v-if="savings > 0.01" class="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
              You save ${{ savings.toFixed(2) }}
            </p>
          </div>

          <!-- Description -->
          <p class="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {{ product.description }}
          </p>

          <!-- Stock / Availability -->
          <div class="mb-5 flex flex-wrap gap-3">
            <div
              :class="[
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
                product.stock > 0
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
              ]"
            >
              <span
                :class="[
                  'h-1.5 w-1.5 rounded-full',
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500',
                ]"
              />
              {{ product.availabilityStatus ?? (product.stock > 0 ? 'In Stock' : 'Out of Stock') }}
            </div>
            <div
              v-if="product.stock > 0 && product.stock < 10"
              class="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
            >
              Only {{ product.stock }} left
            </div>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="mb-4 flex items-center gap-3">
            <!-- Quantity Selector -->
            <div
              class="flex items-center overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <button
                :disabled="quantity <= 1"
                class="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Decrease quantity"
                @click="quantity > 1 && quantity--"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" />
                </svg>
              </button>
              <span class="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                {{ quantity }}
              </span>
              <button
                :disabled="quantity >= product.stock"
                class="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Increase quantity"
                @click="quantity < product.stock && quantity++"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <!-- Add to Cart Button -->
            <button
              :disabled="product.stock === 0"
              :class="[
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 active:scale-[0.98]',
                product.stock === 0
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  : addedFeedback
                    ? 'bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-green-900'
                    : 'bg-primary-600 text-white shadow-md shadow-primary-200 hover:bg-primary-700 dark:shadow-primary-900',
              ]"
              @click="handleAddToCart"
            >
              <svg
                v-if="!addedFeedback"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.4A1 1 0 007.6 20h8.8a1 1 0 00.97-1.24L16 13"
                />
              </svg>
              <svg
                v-else
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {{ addedFeedback ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : `Add ${quantity > 1 ? quantity + ' × ' : ''}to Cart` }}
            </button>
          </div>

          <!-- View Cart Shortcut -->
          <button
            v-if="cartStore.isInCart(product.id)"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-300 py-2.5 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/20"
            @click="cartStore.openDrawer()"
          >
            View Cart ({{ cartStore.getQuantity(product.id) }} in cart)
          </button>

          <!-- Additional Info -->
          <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div
              v-if="product.shippingInformation"
              class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <p class="font-semibold text-gray-700 dark:text-gray-300">🚚 Shipping</p>
              <p class="mt-0.5 text-gray-500 dark:text-gray-400">{{ product.shippingInformation }}</p>
            </div>
            <div
              v-if="product.warrantyInformation"
              class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <p class="font-semibold text-gray-700 dark:text-gray-300">🛡️ Warranty</p>
              <p class="mt-0.5 text-gray-500 dark:text-gray-400">{{ product.warrantyInformation }}</p>
            </div>
            <div
              v-if="product.returnPolicy"
              class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <p class="font-semibold text-gray-700 dark:text-gray-300">↩️ Returns</p>
              <p class="mt-0.5 text-gray-500 dark:text-gray-400">{{ product.returnPolicy }}</p>
            </div>
            <div
              v-if="product.weight"
              class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <p class="font-semibold text-gray-700 dark:text-gray-300">⚖️ Weight</p>
              <p class="mt-0.5 text-gray-500 dark:text-gray-400">{{ product.weight }}g</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="product.reviews && product.reviews.length > 0">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
          <div class="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 dark:bg-amber-900/20">
            <StarRating :rating="averageReviewRating(product.reviews)" size="sm" />
            <span class="text-sm font-bold text-gray-800 dark:text-gray-200">
              {{ averageReviewRating(product.reviews).toFixed(1) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              ({{ product.reviews.length }})
            </span>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(review, i) in product.reviews"
            :key="i"
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-3 flex items-start justify-between gap-2">
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ review.reviewerName }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(review.date) }}</p>
              </div>
              <span
                :class="['rounded-full px-2 py-0.5 text-xs font-bold', ratingColor(review.rating)]"
              >
                {{ review.rating }}/5
              </span>
            </div>
            <StarRating :rating="review.rating" size="sm" />
            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              "{{ review.comment }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
