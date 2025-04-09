<script setup lang="tsx">
import { defineComponent } from 'vue';

export interface Props {
  title: string;
}

const props = defineProps<Props>();

defineComponent({ name: 'XTitle' });
</script>

<template>
  <div class="flex w-full justify-between">
    <div class="flex h-[2rem] text-left text-[1.3rem] font-bold leading-[2rem]">
      <div class="block h-full w-2 rounded-sm bg-[#006be6]"></div>
      <div class="ml-3">{{ `${props.title}` }}</div>
    </div>
    <slot />
  </div>
</template>
