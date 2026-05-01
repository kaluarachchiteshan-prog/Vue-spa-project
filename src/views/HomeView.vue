<script setup lang="ts">
import { onMounted } from 'vue'
import FilterBar from '@/components/FilterBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useProducts } from '@/composables/useProducts'
import { useFilters } from '@/composables/useFilters'

const { products, loading, error, total, fetchProducts } = useProducts()
const { searchQuery, selectedCategory } = useFilters()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <FilterBar />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Search Results Header -->
      <div v-if="searchQuery || selectedCategory !== 'groceries'" class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          <template v-if="searchQuery">
            Results for "<span class="text-primary-600 dark:text-primary-400">{{ searchQuery }}</span>"
          </template>
          <template v-else-if="selectedCategory === 'all'">
            All Products
          </template>
          <template v-else>
            {{ selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) }}
          </template>
        </h1>
        <p v-if="!loading" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ total }} {{ total === 1 ? 'product' : 'products' }} found
        </p>
      </div>

      <!-- Hero Banner (default groceries view) -->
      <div
        v-else-if="!loading"
        class="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white shadow-lg sm:p-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-200">
              Fresh Today
            </p>
            <h1 class="text-2xl font-extrabold leading-tight sm:text-3xl">
              Premium Groceries<br />Delivered to Your Door
            </h1>
            <p class="mt-2 text-sm text-primary-100">Free delivery on orders over $35</p>
          </div>
          <div class="hidden shrink-0 text-7xl opacity-80 sm:block">🛒</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <LoadingSpinner size="lg" />
        <p class="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading products…</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-800 dark:bg-red-900/20"
      >
        <div class="mb-4 text-5xl">⚠️</div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Something went wrong</h3>
        <p class="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
        <button
          class="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          @click="fetchProducts"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="products.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <div class="mb-4 text-6xl">🔍</div>
        <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
        <p class="max-w-sm text-sm text-gray-500 dark:text-gray-400">
          We couldn't find any products matching "<strong>{{ searchQuery }}</strong>".
          Try a different search term or browse by category.
        </p>
      </div>

      <!-- Product Grid -->
      <div
        v-else
        class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Product Count Footer -->
      <p
        v-if="!loading && !error && products.length > 0"
        class="mt-8 text-center text-sm text-gray-400 dark:text-gray-600"
      >
        Showing {{ products.length }} of {{ total }} products
      </p>
    </main>
  </div>
</template>
