<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rating: number
  showValue?: boolean
  size?: 'sm' | 'md'
}>()

const stars = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const val = i + 1
    if (props.rating >= val) return 'full'
    if (props.rating >= val - 0.5) return 'half'
    return 'empty'
  })
})
</script>

<template>
  <div class="flex items-center gap-0.5">
    <template v-for="(type, i) in stars" :key="i">
      <!-- Full star -->
      <svg
        v-if="type === 'full'"
        :class="size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="text-amber-400"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>

      <!-- Half star -->
      <svg
        v-else-if="type === 'half'"
        :class="size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'"
        viewBox="0 0 24 24"
        class="text-amber-400"
      >
        <defs>
          <linearGradient :id="`half-${i}`">
            <stop offset="50%" stop-color="currentColor" />
            <stop offset="50%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path
          :fill="`url(#half-${i})`"
          stroke="currentColor"
          stroke-width="1"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>

      <!-- Empty star -->
      <svg
        v-else
        :class="size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="text-gray-300 dark:text-gray-600"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </template>

    <span
      v-if="showValue"
      :class="size === 'sm' ? 'text-xs' : 'text-sm'"
      class="ml-1 font-medium text-gray-600 dark:text-gray-400"
    >
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>
