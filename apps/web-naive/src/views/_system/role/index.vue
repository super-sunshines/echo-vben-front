<script lang="tsx" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysRoleApi } from '#/api/core/system/role';

import { Page } from '@vben/common-ui';

import {
  NButton,
  NButtonGroup,
  NCard,
  NPopconfirm,
  NSpace,
  NTag,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSysRolePageList } from '#/api/core/system/role';
import { SysDictCodeEnum } from '#/constants';
import { useComponentRef } from '#/hook/use-component-ref';

import SysRoleOperate from './components/role-operate.vue';

const sysRoleOperateRef = useComponentRef(SysRoleOperate);
const gridOptions: VxeGridProps<SysRoleApi.RoleRecord> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'name', width: 200, title: '角色名称' },
    { field: 'code', width: 200, title: '角色码' },
    {
      field: 'enableStatus',
      width: 200,
      title: '状态',
      slots: { default: 'enable' },
    },
    {
      field: 'queryStrategy',
      title: '查询策略',
      cellRender: {
        name: 'CellDictTag',
        props: { code: SysDictCodeEnum.SYS_EXECUTE_STRATEGY },
      },
    },
    {
      field: 'updateStrategy',
      title: '更新策略',
      cellRender: {
        name: 'CellDictTag',
        props: { code: SysDictCodeEnum.SYS_EXECUTE_STRATEGY },
      },
    },
    {
      field: 'description',
      title: '描述',
    },
    { field: '', title: '操作', width: 200, slots: { default: 'action' } },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        message.loading('数据加载中...');
        return await getSysRolePageList({
          page: page.currentPage,
          pageSize: page.pageSize,
        }).finally(() => message.destroyAll());
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <Page
    auto-content-height
    description="对后台管理Web的角色进行管理..."
    title="系统权限管理"
  >
    <template #extra>
      <NSpace>
        <NButton type="primary" @click="() => sysRoleOperateRef?.add()">
          新增角色
        </NButton>
      </NSpace>
    </template>

    <NCard class="h-full pr-3">
      <SysRoleOperate
        ref="sysRoleOperateRef"
        @update:success="() => gridApi.reload()"
      />
      <Grid>
        <template #action="{ row }">
          <NButtonGroup size="small">
            <NButton
              tertiary
              type="primary"
              @click="() => sysRoleOperateRef?.edit(row.id)"
            >
              编辑
            </NButton>
            <NPopconfirm @positive-click="() => {}">
              <template #trigger>
                <NButton tertiary type="error"> 删除 </NButton>
              </template>
              确认删除吗?
            </NPopconfirm>
          </NButtonGroup>
        </template>
        <template #enable="{ row }">
          <NTag :type="row.enableStatus ? 'success' : 'error'">
            {{ row.enableStatus ? '启用' : '禁用' }}
          </NTag>
        </template>
      </Grid>
    </NCard>
  </Page>
</template>
