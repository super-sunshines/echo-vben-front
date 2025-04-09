<script lang="ts" setup>
import { Page } from '@vben/common-ui';

defineOptions({
  name: 'AboutUI',
});
</script>

<template>
  <Page title="XIAOS ADMIN">
    <template #description>
      <p class="text-foreground mt-3 text-sm leading-6">
        <a class="vben-link" href="https://www.reacool.com" target="_blank">
          Reacool Admin 前端快速开的发框架 基于 Vben Admin 5 修改而来
        </a>
      </p>
    </template>
    <div class="card-box p-5">Xiaos</div>
  </Page>
</template>
