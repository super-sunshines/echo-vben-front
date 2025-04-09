<script lang="ts" setup>
import { NEmpty } from 'naive-ui';

defineOptions({ name: 'XEmpty' });
const empty = defineModel('empty', { type: Boolean, default: true });
const description = defineModel('description', {
  type: String,
  default: '',
  required: false,
});
</script>

<template>
  <div class="*:my-2">
    <NEmpty v-show="empty" :description="description">
      <template #extra>
        <slot name="extra"></slot>
      </template>
    </NEmpty>
    <div v-show="!empty">
      <slot>默认内容</slot>
    </div>
  </div>
</template>
