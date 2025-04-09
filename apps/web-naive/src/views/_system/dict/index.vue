<!-- eslint-disable no-use-before-define -->
<script lang="tsx" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDictApi } from '#/api/core/system/dict';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ColPage } from '@vben/common-ui';

import { useClipboard } from '@vueuse/core';
import {
  NButton,
  NButtonGroup,
  NCard,
  NPopconfirm,
  NSpace,
  NTree,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { listDictCodeList, pageListSysDict } from '#/api/core/system/dict';
import { ColPageProps, SysDictCodeEnum } from '#/constants';
import { useComponentRef } from '#/hook/use-component-ref';
import { useDictStore } from '#/store/dict';

import DictOperate from './components/item-operate.vue';

const sysDictOperateRef = useComponentRef(DictOperate);
const selectDictModuleId = ref<number>();

const gridOptions: VxeGridProps<SysDictApi.SysDictRecord> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', width: 150, title: '字典名称' },
    {
      field: 'code',
      title: '字典码',
      minWidth: 300,
      slots: { default: 'code-link' },
    },
    // { field: 'status', width: 150, title: '状态' },
    {
      field: 'module',
      width: 200,
      title: '所属模块',
      cellRender: {
        name: 'CellDictTag',
        props: { code: SysDictCodeEnum.SYS_DICT_MODULE },
      },
    },
    { field: 'describe', title: '描述', minWidth: 200 },
    {
      field: 'updateTime',
      title: '修改时间',
      formatter: 'formatDateTime',
      width: 240,
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
      width: 240,
    },
    {
      field: '',
      title: '操作',
      width: 150,
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
  proxyConfig: {
    autoLoad: true,
    ajax: {
      query: async ({ page }) => {
        message.loading('数据加载中...');
        return await pageListSysDict({
          page: page.currentPage,
          pageSize: page.pageSize,
          module: selectDictModuleId.value,
        }).finally(() => message.destroyAll());
      },
    },
  },
  height: 'auto',
  size: 'medium',
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};
const router = useRouter();
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const { getDictData } = useDictStore();

const { isSupported, copy, copied } = useClipboard();
const onCopy = (value: string) => {
  if (!isSupported.value) {
    message.error('您的浏览器不支持复制功能!请更换最新版谷歌或者火狐浏览器');
    return;
  }
  copy(value);
  if (copied.value) {
    message.success('复制成功');
  }
};

const onTreeSelectTemplate = (v: string[]) => {
  const [select] = v;
  selectDictModuleId.value = Number(select);
  gridApi.reload();
};

const copyCodeEnum = (type: number) => {
  listDictCodeList().then((res: Array<{ code: string; name: string }>) => {
    let targetCopy = '';

    if (type === 1) {
      // Type = 1: 生成 Go 常量
      targetCopy += 'const (\n';
      res.forEach((item) => {
        // 将代码转换为蛇形命名并添加 dict 前缀
        const snakeCaseCode = item.code.replaceAll('-', '_').toUpperCase();
        targetCopy += `
        // ${item.name}
        DICT_${snakeCaseCode} = "${item.code}"\n`;
      });
      targetCopy += ')\n';
    } else if (type === 2) {
      // Type = 2: 生成 TypeScript 枚举
      targetCopy += 'export enum SysDictCodeEnum {\n';
      res.forEach((item) => {
        targetCopy += `
          /**
           * ${item.name}
           */
        \t${item.code.replaceAll('-', '_').toUpperCase()} = "${item.code}",\n`;
      });
      targetCopy += '}\n';
    }

    // 复制到剪贴板
    copy(targetCopy);
  });
};

const dictModuleList = getDictData(SysDictCodeEnum.SYS_DICT_MODULE) as any;
</script>
<template>
  <ColPage
    v-bind="ColPageProps"
    auto-content-height
    title="字典管理"
    description="对后台管理Web的字典进行管理..."
  >
    <template #left="{ isCollapsed }">
      <div
        :style="{ minWidth: '200px' }"
        class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-2"
      >
        <NCard v-if="!isCollapsed" :segmented="true" class="h-full">
          <template #footer>
            <NButton class="w-full" size="small"> 新增 </NButton>
          </template>

          <NTree
            :cancelable="false"
            :data="dictModuleList"
            :on-update:selected-keys="onTreeSelectTemplate"
            key-field="value"
          />
        </NCard>
      </div>
    </template>
    <template #extra>
      <DictOperate
        ref="sysDictOperateRef"
        @update:success="() => gridApi.reload()"
      />
      <NSpace>
        <NPopconfirm
          @positive-click="() => copyCodeEnum(1)"
          @negative-click="() => copyCodeEnum(2)"
          positive-text="GO"
          negative-text="TS"
          :negative-button-props="{ type: 'primary' }"
          :show-icon="false"
        >
          <template #trigger>
            <NButton> 复制字典枚举 </NButton>
          </template>
          选择复制的语言
        </NPopconfirm>

        <NButton type="primary" @click="() => sysDictOperateRef?.add()">
          新增字典
        </NButton>
      </NSpace>
    </template>

    <Grid>
      <template #code-link="{ row }">
        <NSpace justify="center" align="center">
          <span
            class="hover:scale-130 cursor-pointer text-[1rem] text-blue-500 underline underline-offset-4 hover:text-blue-700"
            @click="
              () =>
                router.push({
                  path: '/system/dict/child',
                  query: { code: row.code },
                })
            "
          >
            {{ row.code }}
          </span>
          <NButton size="tiny" dashed @click="() => onCopy(row.code)">
            复制
          </NButton>
        </NSpace>
      </template>
      <template #action="{ row }">
        <NButtonGroup size="small">
          <NButton
            tertiary
            type="primary"
            @click="() => sysDictOperateRef?.edit(row.id)"
          >
            编辑
          </NButton>
        </NButtonGroup>
      </template>
    </Grid>
  </ColPage>
</template>
