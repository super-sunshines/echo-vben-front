<script lang="tsx" setup>
import type { VxeGridProps } from '@vben/plugins/vxe-table';

import type { SysLogApi } from '#/api/core/system/log';

import { Page } from '@vben/common-ui';

import { NTag } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { pageListSysLoginLog } from '#/api/core/system/log';

interface RowType extends SysLogApi.LoginLogInfo {}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'operateName', title: '账号', width: 300 },
    { field: 'browser', title: '浏览器类型', width: 200 },
    { field: 'os', title: '操作平台', width: 120 },
    { field: 'operateIp', title: 'IP', width: 150 },
    { field: 'operateLocation', title: '地址', width: 220 },
    { field: 'operateTime', title: '操作时间', width: 140 },
    {
      field: 'status',
      title: '请求状态',
      width: 100,
      slots: {
        default: ({ row }) => getStatus(row.status!),
      },
    },
    { field: 'msg', title: '错误信息' },
  ],
  height: 'auto',
  border: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await pageListSysLoginLog({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  exportConfig: {},
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
  sortConfig: {
    multiple: true,
  },
};
interface TagObject {
  [key: number]: any;
}

const statusMap: TagObject = {
  1: { text: '正确', type: 'success' },
  2: { text: '错误', type: 'error' },
};

function getStatus(status: number) {
  const item = statusMap[status] ?? { text: '正确', type: 'success' };
  return <NTag type={item.type}>{item.text}</NTag>;
}

const [Grid] = useVbenVxeGrid({ gridOptions });
const render = () => {
  return (
    <Page autoContentHeight={true} title="操作日志">
      <Grid></Grid>
    </Page>
  );
};
</script>

<template>
  <component :is="render" />
</template>
