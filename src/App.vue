<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import CartDrawer from '@/components/CartDrawer.vue'
import LoginModal from '@/components/LoginModal.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useDarkMode } from '@/composables/useDarkMode'

const authStore = useAuthStore()
const cartStore = useCartStore()

// Initialise dark mode (applies stored preference to <html> class)
useDarkMode()

const isLoginOpen = ref(false)

onMounted(() => {
  // Restore persisted auth session and cart
  authStore.init()
  cartStore.init()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased transition-colors duration-300 dark:bg-gray-900">
    <NavBar @open-login="isLoginOpen = true" />

    <RouterView v-slot="{ Component }">
      <transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </RouterView>

    <CartDrawer />

    <LoginModal :is-open="isLoginOpen" @close="isLoginOpen = false" />
  </div>
</template>
