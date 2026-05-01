<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
  color?: string
}>()
</script>

<template>
  <div
    role="status"
    aria-label="Loading"
    :class="[
      'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
      size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-12 w-12 border-4' : 'h-8 w-8',
      color ?? 'text-primary-600 dark:text-primary-400',
    ]"
  />
</template>
