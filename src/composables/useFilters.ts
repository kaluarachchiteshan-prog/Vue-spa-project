import { ref, type Ref } from 'vue'

// Module-level singleton — shared across all components that import this composable
const searchQuery: Ref<string> = ref('')
const selectedCategory: Ref<string> = ref('groceries')

export function useFilters() {
  function setCategory(slug: string): void {
    selectedCategory.value = slug
    // Clear search when switching categories for a clean UX
    if (searchQuery.value) searchQuery.value = ''
  }

  function setSearch(query: string): void {
    searchQuery.value = query
  }

  function clearSearch(): void {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    selectedCategory,
    setCategory,
    setSearch,
    clearSearch,
  }
}
