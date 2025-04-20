<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui';

import type { SysDepartmentApi } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { NButton, NButtonGroup, NDataTable, NSpace } from 'naive-ui';

import { message } from '#/adapter/naive';
import { treeListSysDepartment } from '#/api';
import { NTimeFormatRender } from '#/components';
import useBoolean from '#/hook/use-boolean';
import { useComponentRef } from '#/hook/use-component-ref';
import DepartmentOperate from '#/views/_system/department/components/department-operate.vue';

const departmentOperateRef = useComponentRef(DepartmentOperate);
interface RowData extends SysDepartmentApi.SysDepartmentRecord {}
const data = ref<Array<RowData>>([]);

const initModelTreeList = () => {
  setDataLoad(true);
  message.loading('数据加载中...', { duration: 0 });
  treeListSysDepartment().then((res) => {
    data.value = res;
    message.destroyAll();
    setDataLoad(false);
    message.success('数据加载成功!');
    setDefaultExpandAll(true);
  });
};
const columns: DataTableColumns<RowData> = [
  {
    type: 'selection',
  },
  {
    title: '部门名称',
    key: 'name',
  },
  {
    title: '描述',
    key: 'description',
  },
  {
    title: '修改时间',
    key: 'updateTime',
    render: (row) => NTimeFormatRender(row, 'updateTime'),
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => NTimeFormatRender(row, 'createTime'),
  },
  {
    title: '操作',
    key: 'operate',
    width: 300,
    fixed: 'right',
    align: 'center',
    render(row) {
      return (
        row.pid !== 0 && (
          <NSpace justify="center">
            <NButtonGroup size={'small'}>
              <NButton
                onClick={() => departmentOperateRef.value?.add(row.id)}
                secondary={true}
                strong={true}
                type="primary"
              >
                {'新增子部门'}
              </NButton>
              <NButton secondary={true} strong={true} type={'error'}>
                {'删除'}
              </NButton>
              {
                <NButton
                  onClick={() => departmentOperateRef.value?.edit(row.id)}
                  secondary={true}
                  strong={true}
                  type="warning"
                >
                  {'修改'}
                </NButton>
              }
            </NButtonGroup>
          </NSpace>
        )
      );
    },
  },
];

const { bool: dataLoad, setBool: setDataLoad } = useBoolean();
const { bool: defaultExpandAll, setBool: setDefaultExpandAll } = useBoolean();

initModelTreeList();
</script>

<template>
  <Page title="组织管理">
    <template #extra>
      <NSpace>
        <NButtonGroup>
          <NButton type="primary" @click="departmentOperateRef?.add()">
            新增组织
          </NButton>
        </NButtonGroup>
      </NSpace>
    </template>
    <DepartmentOperate
      ref="departmentOperateRef"
      :department-tree="data"
      @submit="initModelTreeList"
    />
    <NDataTable
      :columns="columns"
      v-if="defaultExpandAll"
      :loading="dataLoad"
      :data="data"
      :default-expand-all="defaultExpandAll"
      :row-key="(rowKey) => rowKey.id"
    />
  </Page>
</template>
