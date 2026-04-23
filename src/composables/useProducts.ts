import { ref, watch } from 'vue'
import { useFilters } from '@/composables/useFilters'
import type { Product, ProductsResponse, Category } from '@/types'

export function useProducts() {
  const { searchQuery, selectedCategory } = useFilters()

  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)

  // ─── Categories ─────────────────────────────────────────────────────────────

  async function fetchCategories(): Promise<void> {
    try {
      const response = await fetch('https://dummyjson.com/products/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = (await response.json()) as Category[]
      categories.value = data
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  // ─── Products ───────────────────────────────────────────────────────────────

  async function fetchProducts(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      let url: string
      const q = searchQuery.value.trim()

      if (q) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=30`
      } else if (selectedCategory.value === 'all') {
        url = 'https://dummyjson.com/products?limit=30'
      } else {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory.value)}?limit=30`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

      const data = (await response.json()) as ProductsResponse
      products.value = data.products
      total.value = data.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load products'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // ─── Watchers ───────────────────────────────────────────────────────────────

  // Re-fetch whenever search query or category changes
  watch([searchQuery, selectedCategory], () => {
    fetchProducts()
  })

  return {
    products,
    categories,
    loading,
    error,
    total,
    fetchCategories,
    fetchProducts,
  }
}

// ─── Single product fetcher ──────────────────────────────────────────────────

export function useProduct() {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProduct(id: number): Promise<void> {
    loading.value = true
    error.value = null
    product.value = null

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`)
      if (!response.ok) throw new Error(`Product not found (${response.status})`)
      product.value = (await response.json()) as Product
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load product'
    } finally {
      loading.value = false
    }
  }

  return { product, loading, error, fetchProduct }
}
