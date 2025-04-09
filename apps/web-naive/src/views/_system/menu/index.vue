<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui';
import type { RowKey } from 'naive-ui/es/data-table/src/interface';

import type { SysMenuApi } from '#/api/core/system/menu';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';

import { NButton, NDataTable, NPopconfirm, NSpace, NTag } from 'naive-ui';

import { message } from '#/adapter/naive';
import { deleteSysMenu, getSysMenuList } from '#/api/core/system/menu';
import { MenuType, SysMenuTypeTagProp, tagPropToOptions } from '#/constants';
import useBoolean from '#/hook/use-boolean';
import { useComponentRef } from '#/hook/use-component-ref';

import { NTagRender } from '#/utils';
import SysMenuOperate from './components/menu-operate.vue';
import SysPermissionOperate from './components/permission-operate.vue';

const sysMenuOperateRef = useComponentRef(SysMenuOperate);
const sysPermissionOperateRef = useComponentRef(SysPermissionOperate);

const columns: DataTableColumns<SysMenuApi.SysMenuRecord> = [
  { type: 'selection' },
  {
    key: '',
    title: '标题',
    render: (row: any) => {
      return row.type === MenuType.Api ? row.apiDescription : row.meta.title;
    },
  },
  {
    key: '',
    title: '图标',
    width: 80,
    render: (row: any) =>
      h(createIconifyIcon(row.meta.icon), {
        class: 'size-5',
      }),
  },
  {
    key: 'type',
    title: '组件类型',
    width: 100,
    render: (row) =>
      NTagRender({
        value: row.type,
        options: tagPropToOptions(SysMenuTypeTagProp),
        tagProps: SysMenuTypeTagProp,
      }),
  },
  {
    key: 'order',
    title: '排序',
    width: 100,
    render: (row) => row.meta.order,
  },
  {
    key: 'type',
    title: '显示状态',
    width: 100,
    render: (row) => {
      return (
        <NTag type={row.meta.hideInMenu ? 'warning' : 'success'}>
          {row.meta.hideInMenu ? '隐藏' : '显示'}
        </NTag>
      );
    },
  },
  {
    key: 'path',
    title: '访问路径',
    render: (row) => {
      return row.type === MenuType.Api ? row.apiCode : row.path;
    },
  },
  {
    key: '',
    title: '组件路径',
    render: (row) => {
      return row.component;
    },
  },

  {
    title: '操作',
    fixed: 'left',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () =>
            row.type === MenuType.Api
              ? sysPermissionOperateRef.value?.edit(Number(row.id))
              : sysMenuOperateRef.value?.edit(Number(row.id)),
        },
        { default: () => '编辑' },
      );
    },
  },
];
const { bool: tableShow, setBool: setTableShow } = useBoolean(false);

const menuTreeList = ref<SysMenuApi.SysMenuRecord[]>([]);

const selectKeys = ref<number[]>([]);
const handleCheck = (selects: RowKey[]) => {
  selectKeys.value = selects as number[];
};
const initSysMenuData = () => {
  setTableShow(false);
  getSysMenuList().then((res) => {
    menuTreeList.value = res;
    setTableShow(true);
  });
};
const onMenuDeleteBtnClick = () => {
  if (selectKeys.value.length === 0) {
    message.error('请选择要删除的菜单');
    return;
  }
  message.loading('删除中....');
  deleteSysMenu(selectKeys.value)
    .then(() => {
      message.destroyAll();
      message.success('删除成功');
      initSysMenuData();
    })
    .catch((error) => {
      message.destroyAll();
      message.error(error);
    })
    .finally(() => message.destroyAll());
};

initSysMenuData();
</script>

<template>
  <Page
    auto-content-height
    description="对后台管理Web的左侧的菜单进行管理，修改、隐藏、删除、更新等..."
    title="系统目录管理"
  >
    <template #extra>
      <NSpace>
        <NPopconfirm @positive-click="onMenuDeleteBtnClick">
          <template #trigger>
            <NButton type="error"> 删除菜单 </NButton>
          </template>
          该目录删除后子目录会移动至顶级目录下
        </NPopconfirm>

        <NButton type="success" @click="() => sysMenuOperateRef?.add()">
          新增菜单
        </NButton>
        <NButton type="warning" @click="() => sysPermissionOperateRef?.add()">
          分配权限
        </NButton>
      </NSpace>
    </template>
    <SysMenuOperate ref="sysMenuOperateRef" @update:success="initSysMenuData" />
    <SysPermissionOperate
      ref="sysPermissionOperateRef"
      @update:success="initSysMenuData"
    />
    <NDataTable
      v-if="tableShow"
      :bordered="false"
      :columns="columns"
      :data="menuTreeList"
      :row-key="(row) => row.id"
      :single-line="false"
      default-expand-all
      striped
      @update:checked-row-keys="handleCheck"
    />
  </Page>
</template>
