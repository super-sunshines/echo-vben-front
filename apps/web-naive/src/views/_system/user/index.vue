<!-- eslint-disable no-use-before-define -->
<script lang="tsx" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SysDepartmentApi, SysRoleApi, SysUserApi } from '#/api';

import { onMounted, ref } from 'vue';

import { ColPage, VbenAvatar } from '@vben/common-ui';

import { NButton, NButtonGroup, NPopconfirm, NSpace } from 'naive-ui';

import { message } from '#/adapter/naive';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSysRolePageList,
  pageListSysUser,
  treeListSysDepartment,
} from '#/api';
import { SysDepartmentTree } from '#/components';
import { ColPageProps } from '#/constants';
import { useComponentRef } from '#/hook/use-component-ref';

import SysUserOperate from './components/user-operate.vue';

const sysUserOperateRef = useComponentRef(SysUserOperate);
const roleSelectList = ref<SysRoleApi.RoleRecord[]>([]);
const treeSysDepartment = ref<Array<SysDepartmentApi.SysDepartmentRecord>>([]);

const initDepartmentModelTreeList = () => {
  treeListSysDepartment().then((res) => {
    treeSysDepartment.value = res;
  });
};
initDepartmentModelTreeList();
const initRoleSelect = async () => {
  gridApi.setLoading(true);
  await getSysRolePageList({
    page: 1,
    pageSize: 1000,
  }).then(({ items }) => {
    roleSelectList.value = items;
    gridApi.setLoading(false);
    gridApi.reload();
  });
};
onMounted(async () => {
  await initRoleSelect();
});

const pageListSysUserParams = ref({
  departmentId: 0,
});

const gridOptions: VxeGridProps<SysUserApi.SysUserRecord> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'avatar', title: '头像', width: 80, slots: { default: 'avatar' } },
    { field: 'nickName', width: 200, title: '昵称' },
    { field: 'realName', width: 200, title: '真实名称' },
    {
      field: 'roleCodeList',
      title: '角色列表',
      minWidth: 300,
      cellRender: {
        name: 'CellTag',
        props: {
          options: roleSelectList,
          valueKey: 'code',
          labelKey: 'name',
        },
      },
    },
    {
      field: 'status',
      width: 200,
      title: '状态',
      cellRender: {
        name: 'CellTag',
        props: {
          options: [
            { label: '正常', value: 1 },
            { label: '封禁', value: 2 },
          ],
        },
      },
    },
    { field: 'email', title: '邮箱', width: 150 },
    { field: 'phone', title: '手机号', width: 150 },

    {
      field: 'lastOnline',
      title: '最近登录时间',
      formatter: 'formatDateTime',
      width: 200,
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
      width: 200,
    },
    {
      field: '',
      title: '操作',
      width: 200,
      slots: { default: 'action' },
      fixed: 'right',
    },
  ],
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }) => {
        message.loading('数据加载中...');
        return await pageListSysUser({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...pageListSysUserParams.value,
        }).finally(() => message.destroyAll());
      },
    },
  },
  exportConfig: {},
  height: 'auto',
  size: 'medium',
  pagerConfig: {},
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    zoom: true,
  },
};
const onTreeSelectTemplate = (v: string[]) => {
  const [select] = v;
  pageListSysUserParams.value.departmentId = Number(select);
  gridApi.reload();
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <ColPage v-bind="ColPageProps" auto-content-height title="系统用户管理">
    <template #extra>
      <NSpace>
        <NButton type="primary" @click="() => sysUserOperateRef?.add()">
          新增用户
        </NButton>
      </NSpace>
    </template>
    <template #left>
      <SysUserOperate
        ref="sysUserOperateRef"
        :tree-sys-department="treeSysDepartment"
        @update:success="() => gridApi.reload()"
      />
      <SysDepartmentTree :on-update:selected-keys="onTreeSelectTemplate" />
    </template>

    <Grid>
      <template #action="{ row }">
        <NButtonGroup size="small">
          <NButton
            tertiary
            type="primary"
            @click="() => sysUserOperateRef?.edit(row.id)"
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
      <template #avatar="{ row }">
        <VbenAvatar
          :alt="row.realName"
          :src="row.avatar"
          class="h-10 w-10 p-1"
        />
      </template>
    </Grid>
  </ColPage>
</template>
