<script lang="tsx" setup>
import type { VxeGridProps } from '@vben/plugins/vxe-table';

import type { SysLogApi } from '#/api/core/system/log';

import { ref } from 'vue';

import { JsonViewer, Page, useVbenModal } from '@vben/common-ui';

import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { pageListSysOperateLog } from '#/api/core/system/log';

interface RowType extends SysLogApi.OperateLogRecord {}
const getTextAfterLastThirdSlash = (fullPath: string) => {
  const segments = fullPath.split('/');
  return segments.length >= 2 ? segments.slice(-2).join('/') : null;
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { field: 'id', title: '序号', width: 100 },
    { field: 'title', title: '标题', width: 150 },
    {
      field: 'businessType',
      title: '业务类型',
      width: 90,
      slots: {
        default: ({ row }) => getbusinessTypeMap(row.businessType!),
      },
    },
    { field: 'operateUrl', title: '访问地址', width: 200 },
    { field: 'costTime', title: '花费时间', width: 80 },
    { field: 'operateDepart', title: '部门', width: 100 },
    { field: 'operateIp', title: 'IP', width: 150 },
    { field: 'operateLocation', title: '地址', width: 180 },
    { field: 'operateName', title: '操作人', width: 100 },
    { field: 'operateTime', title: '操作时间', width: 140 },
    { field: 'operateType', title: '操作类型', width: 100 },
    {
      field: 'requestMethod',
      title: '请求方法',
      width: 80,
    },
    {
      field: 'status',
      title: '请求状态',
      width: 100,
      slots: {
        default: ({ row }) => getStatus(row.status!),
      },
    },
    {
      field: 'callFunc',
      title: '调用方法',
      width: 300,
      slots: {
        default: ({ row }) => (
          <div>{getTextAfterLastThirdSlash(row.callFunc!)}</div>
        ),
      },
    },
    { field: 'errorMsg', title: '错误信息', width: 150 },
    {
      field: 'operate',
      title: '操作',
      fixed: 'right',
      width: 80,
      slots: {
        default: ({ row }) => {
          return (
            <div
              class={'text-primary cursor-pointer text-center'}
              onClick={() => {
                selectLogItem.value = row;
                modalApi.open();
              }}
            >
              {'详情'}
            </div>
          );
        },
      },
    },
  ],
  height: 'auto',
  border: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await pageListSysOperateLog({
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
const businessTypeMap: TagObject = {
  1: { text: '查询', type: 'success' },
  2: { text: '新增', type: 'info' },
  3: { text: '修改', type: 'warning' },
  4: { text: '删除', type: 'error' },
  5: { text: '导入', type: 'info' },
  6: { text: '导出', type: 'info' },
  7: { text: '其他', type: 'primary' },
};
const statusMap: TagObject = {
  1: { text: '正确', type: 'success' },
  2: { text: '错误', type: 'error' },
};

function getStatus(status: number) {
  const item = statusMap[status] ?? { text: '正确', type: 'success' };
  return <NTag type={item.type}>{item.text}</NTag>;
}
function getbusinessTypeMap(businessType: number) {
  const item = businessTypeMap[businessType] ?? {
    text: '其他',
    type: 'primary',
  };
  return <NTag type={item.type}>{item.text}</NTag>;
}

const selectLogItem = ref<SysLogApi.OperateLogRecord>();
const [Grid] = useVbenVxeGrid({ gridOptions });
const [Modal, modalApi] = useVbenModal();
const render = () => {
  return (
    <Page autoContentHeight={true} title="操作日志">
      <Modal class={'w-[800px]'} title="日志详情">
        <NDescriptions bordered={true} column={6} labelPlacement={'top'}>
          <NDescriptionsItem label="标题" span={2}>
            {selectLogItem.value?.title}
          </NDescriptionsItem>
          <NDescriptionsItem label="业务类型" span={2}>
            {getbusinessTypeMap(selectLogItem.value?.businessType!)}
          </NDescriptionsItem>
          <NDescriptionsItem label="访问地址" span={2}>
            {selectLogItem.value?.operateUrl}
          </NDescriptionsItem>
          <NDescriptionsItem label="操作者" span={2}>
            {selectLogItem.value?.operateName}
          </NDescriptionsItem>
          <NDescriptionsItem label="操作部门" span={2}>
            {selectLogItem.value?.operateDepart}
          </NDescriptionsItem>
          <NDescriptionsItem label="操作时间" span={2}>
            {selectLogItem.value?.operateTime}
          </NDescriptionsItem>
          <NDescriptionsItem label="请求方法" span={1}>
            {selectLogItem.value?.requestMethod}
          </NDescriptionsItem>
          <NDescriptionsItem label="操作IP" span={2}>
            {selectLogItem.value?.operateIp}
          </NDescriptionsItem>
          <NDescriptionsItem label="请求状态" span={1}>
            {getStatus(selectLogItem.value?.status!)}
          </NDescriptionsItem>
          <NDescriptionsItem label="操作地址" span={2}>
            {selectLogItem.value?.operateLocation}
          </NDescriptionsItem>
          <NDescriptionsItem label="请求参数" span={6}>
            {selectLogItem.value?.operateParam ?? '无'}
          </NDescriptionsItem>
          <NDescriptionsItem label="请求体" span={6}>
            {selectLogItem.value?.requestJsonBody ? (
              <JsonViewer
                boxed={true}
                expandDepth={4}
                showArrayIndex={true}
                value={JSON.parse(selectLogItem.value?.requestJsonBody || '')}
              ></JsonViewer>
            ) : (
              <div>{'无'}</div>
            )}
          </NDescriptionsItem>
          <NDescriptionsItem label="响应结果" span={6}>
            {selectLogItem.value?.jsonResult && (
              <JsonViewer
                boxed={true}
                expandDepth={4}
                showArrayIndex={true}
                value={JSON.parse(selectLogItem.value?.jsonResult || '')}
              ></JsonViewer>
            )}
          </NDescriptionsItem>
        </NDescriptions>
      </Modal>
      <Grid></Grid>
    </Page>
  );
};
</script>

<template>
  <component :is="render" />
</template>
