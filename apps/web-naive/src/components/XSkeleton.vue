<script lang="ts" setup>
import { NButton, NResult, NSkeleton } from 'naive-ui';

defineOptions({ name: 'XSkeleton' });
const loading = defineModel('loading', { type: Boolean, default: true });
const count = defineModel('count', { type: Number, default: 3 });
const fail = defineModel('fail', { type: Boolean, default: false });

// 定义 failProps 的类型
interface FailProps {
  showFailBtn?: boolean;
  failBtnTText?: string;
  failBtnFn?: () => void;
  title?: string;
  description?: string;
  status?:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | '404'
    | '403'
    | '500'
    | '418';
}

const failProps = withDefaults(defineProps<FailProps>(), {
  status: '404',
  title: '内容丢失了',
  description: '到别处看看吧！',
  failBtnTText: '返回首页',
  showFailBtn: true,
  failBtnFn: () => {},
});
</script>
<template>
  <div class="*:h-full">
    <div v-show="fail" class="*:my-2">
      <NResult v-bind="failProps">
        <template #footer>
          <NButton v-show="showFailBtn" @click="failBtnFn">{{
            failBtnTText
          }}</NButton>
        </template>
      </NResult>
    </div>
    <div v-show="!fail" class="*:h-full">
      <div v-show="loading" class="*:my-2">
        <NSkeleton
          v-for="item in count"
          :key="item"
          :height="30"
          :repeat="1"
          animated
          round
        />
      </div>
      <div v-show="!loading">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
