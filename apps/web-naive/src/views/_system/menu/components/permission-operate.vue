<script lang="tsx" setup>
import type { DataTableColumns } from 'naive-ui';

import type { SysMenuApi } from '#/api/core/system/menu';

import { defineComponent, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NTreeSelect,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import {
  addNewCodes,
  detailSysMenu,
  editCodes,
  getNewCodes,
  getSysMenuSimpleList,
} from '#/api/core/system/menu';
import XSkeleton from '#/components/XSkeleton.vue';
import useBoolean from '#/hook/use-boolean';
// 定义emit事件及其参数类型
const emit = defineEmits<{
  (event: 'update:success'): void;
}>();
const fillCodeList = ref<SysMenuApi.ApiCodeBo[]>([]);

const { bool: modelLoad, setBool: setModelLoad } = useBoolean(false);
const operateId = ref(0);

const onAddDrawerConfirm = () => {
  message.loading('加载中...');
  for (const item of fillCodeList.value) {
    if (item.description === '') {
      message.destroyAll();
      message.error(`请填写权限码为:${item.code}的接口信息`);
      return;
    }
  }
  addNewCodes(fillCodeList.value)
    .then(() => {
      message.success('添加成功！');
      drawerApi.close();
      emit('update:success');
    })
    .catch((error: any) => {
      message.error(error);
    });
};
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: onAddDrawerConfirm,
});

const editModel = ref({
  id: 0,
  description: '',
  code: '',
  pid: 0,
});
const initEditMenu = () => {
  detailSysMenu(operateId.value)
    .then((res) => {
      editModel.value = {
        id: res.id,
        description: res.apiDescription,
        code: res.apiCode,
        pid: res.pid,
      };
    })
    .then(() => setModelLoad(false));
};
const onEditDrawerConfirm = () => {
  message.loading('修改中...');
  editCodes(operateId.value, editModel.value)
    .then((_) => {
      message.destroyAll();
      message.success('修改成功');
      editDrawerApi.close();
      emit('update:success');
    })
    .catch((error) => {
      message.destroyAll();
      message.error(error);
    });
};

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  onConfirm: onEditDrawerConfirm,
});

function add() {
  initNewCodes();
  operateId.value = 0;
  drawerApi.open();
}

function edit(id: number) {
  operateId.value = id;
  initEditMenu();
  editDrawerApi.open();
}

defineExpose({
  add,
  edit,
});
const menuSimpleTreeSelect = ref<SysMenuApi.SimpleMenuVo[]>([]);
const initSimpleMenuTree = () => {
  getSysMenuSimpleList({
    includeTopLevel: true,
    includePermissions: false,
  }).then((res) => {
    menuSimpleTreeSelect.value = res;
  });
};

const dataTableColumns: DataTableColumns = [
  {
    title: '权限码',
    width: 180,
    key: 'code',
  },
  {
    title: '所属目录',
    key: 'pid',
    width: 180,
    render: (row) => {
      return (
        <NTreeSelect
          keyField="value"
          options={menuSimpleTreeSelect.value}
          v-model:value={row.pid}
        ></NTreeSelect>
      );
    },
  },
  {
    title: '接口描述',
    key: 'description',
    render: (row) => {
      return <NInput v-model:value={row.description}></NInput>;
    },
  },
];

const initNewCodes = () => {
  setModelLoad(true);
  getNewCodes().then((res) => {
    res.forEach((i) => {
      fillCodeList.value.push({
        description: '',
        code: i,
        pid: 0,
      });
    });
    setModelLoad(false);
  });
};
initSimpleMenuTree();

defineComponent({ name: 'SysPermissionOperate' });
</script>

<template>
  <div>
    <Drawer class="w-[800px]" title="新增权限码">
      <XSkeleton :loading="modelLoad">
        <NDataTable :columns="dataTableColumns" :data="fillCodeList" />
      </XSkeleton>
    </Drawer>
    <EditDrawer class="w-[500px]" title="编辑权限码">
      <XSkeleton :loading="modelLoad">
        <NForm>
          <NFormItem label="ID">
            <NInputNumber
              v-model:value="editModel.id"
              class="w-full"
              disabled
            />
          </NFormItem>
          <NFormItem label="权限码">
            <NInput v-model:value="editModel.code" disabled />
          </NFormItem>
          <NFormItem label="所属目录">
            <NTreeSelect
              v-model:value="editModel.pid"
              :options="menuSimpleTreeSelect"
              key-field="value"
            />
          </NFormItem>
          <NFormItem label="描述">
            <NInput v-model:value="editModel.description" type="textarea" />
          </NFormItem>
        </NForm>
      </XSkeleton>
    </EditDrawer>
  </div>
</template>
