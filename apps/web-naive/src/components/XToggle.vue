<script lang="ts" setup>
import useBoolean from '#/hook/use-boolean';
import { NSpace, NThing, NButton } from 'naive-ui';
import { IconifyIcon } from '@vben/icons';
defineOptions({ name: 'XToggle' });
const { bool: show, toggle: toggle } = useBoolean(true);

const label = defineModel('label', { type: String, default: '' });
defineExpose({ toggle });
</script>

<template>
  <NSpace class="leading-relaxed" align="center">
    <span class="font-bold">{{ label }}</span>
    <NThing v-if="show">
      <slot></slot>
    </NThing>
    <NThing v-else>
      <slot name="edit"> </slot>
    </NThing>
    <NButton @click="toggle" circle v-if="show">
      <template #icon>
        <IconifyIcon :icon="'carbon:pen'" class="size-full" />
      </template>
    </NButton>
  </NSpace>
</template>
