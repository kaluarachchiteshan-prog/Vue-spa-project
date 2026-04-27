<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useFilters } from '@/composables/useFilters'

const { categories, fetchCategories } = useProducts()
const { selectedCategory, setCategory } = useFilters()

onMounted(() => {
  fetchCategories()
})

// Capitalise each word for display
function formatCategoryName(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <div
    class="sticky top-16 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900/95"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="scrollbar-thin flex gap-2 overflow-x-auto py-3">
        <!-- "All" pill -->
        <button
          :class="[
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
            selectedCategory === 'all'
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-200 dark:shadow-primary-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          ]"
          @click="setCategory('all')"
        >
          All Products
        </button>

        <!-- Category pills -->
        <button
          v-for="cat in categories"
          :key="cat.slug"
          :class="[
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
            selectedCategory === cat.slug
              ? 'bg-primary-600 text-white shadow-sm shadow-primary-200 dark:shadow-primary-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          ]"
          @click="setCategory(cat.slug)"
        >
          {{ formatCategoryName(cat.name) }}
        </button>
      </div>
    </div>
  </div>
</template>
