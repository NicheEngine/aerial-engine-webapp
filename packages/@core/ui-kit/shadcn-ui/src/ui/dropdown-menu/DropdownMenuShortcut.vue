<script setup lang="ts">
import { cn } from '@aerial-engine-core/shared/utils';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest opacity-60', props.class)">
    <slot></slot>
  </span>
</template>
