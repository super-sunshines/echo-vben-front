<script lang="ts" setup>
import { Fallback } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

defineOptions({ name: 'Fallback404Demo' });

const userInfo = useUserStore();
</script>

<template>
  <Fallback status="404" :home-path="userInfo.userInfo?.homePath" />
</template>
