<script lang="tsx" setup>
import type { FormItemRule } from 'naive-ui';

import type { SysMenuApi } from '#/api/core/system/menu';
import type { SysRoleApi } from '#/api/core/system/role';

import { computed, defineComponent, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTree,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import { getSysMenuSimpleList } from '#/api/core/system/menu';
import {
  addSysRole,
  detailSysRole,
  updateSysRole,
} from '#/api/core/system/role';
import XSkeleton from '#/components/XSkeleton.vue';
import { SysDictCodeEnum } from '#/constants';
import useBoolean from '#/hook/use-boolean';
import { useComponentRef } from '#/hook/use-component-ref';
import { useDictStore } from '#/store';

// 定义emit事件及其参数类型
const emit = defineEmits<{
  (event: 'update:success'): void;
}>();

const nFormRef = useComponentRef(NForm);

const model = ref<SysRoleApi.RoleRecord>({
  name: '',
  code: '',
  description: '',
  enableStatus: false,
  queryStrategy: 1,
  updateStrategy: 1,
  homePath: '',
  id: 0,
  menuIdList: [],
});
const { bool: modelLoad, setBool: setModelLoad } = useBoolean(false);
const operateId = ref(0);
const isAdd = computed(() => operateId.value === 0);

// const rules: FormRules = {};

const resetModel = () => {
  model.value = {
    name: '',
    code: '',
    description: '',
    enableStatus: false,
    queryStrategy: 1,
    updateStrategy: 1,
    homePath: '',
    id: 0,
    menuIdList: [],
  };
};

const { getSelectOption } = useDictStore();

function fetchModelInfo() {
  detailSysRole(operateId.value)
    .then((res) => {
      model.value = res;
    })
    .then(() => setModelLoad(false));
}

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => onSubmit(model.value),
});
function onSubmit(values: any | Record<string, any>) {
  nFormRef.value?.validate((errors) => {
    if (errors) {
      message.error('请检查填写情况！');
    } else {
      message.loading('数据提交中请稍后！');
      if (isAdd.value) {
        addSysRole(values)
          .then(() => {
            drawerApi.close();
            emit('update:success');
          })
          .finally(() => {
            message.destroyAll();
          });
      } else {
        updateSysRole(operateId.value, values)
          .then(() => {
            drawerApi.close();
            emit('update:success');
          })
          .finally(() => {
            message.destroyAll();
          });
      }
      message.destroyAll();
    }
  });
}

function add() {
  operateId.value = 0;
  resetModel();
  drawerApi.open();
}

function edit(id: number) {
  operateId.value = id;
  fetchModelInfo();
  drawerApi.open();
}
defineExpose({
  add,
  edit,
});

const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入角色名称',
  },
  code: {
    required: true,
    validator(_: FormItemRule, value: number) {
      return /^[a-z_]{5,15}$/i.test(`${value}`);
    },
    trigger: ['blur', 'input'],
    message: '请输入5-15位的角色代码,仅包含大小写字母与下划线',
  },
  description: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入描述',
  },

  homePath: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入登录后首页地址',
  },
};

const menuSimpleTreeSelect = ref<SysMenuApi.SimpleMenuVo[]>([]);
const initSimpleMenuTree = () => {
  getSysMenuSimpleList({
    includeTopLevel: false,
    includePermissions: true,
  }).then((res) => {
    menuSimpleTreeSelect.value = res;
  });
};
initSimpleMenuTree();
defineComponent({ name: 'SysRoleOperate' });
</script>

<template>
  <Drawer :title="isAdd ? '新增角色' : '编辑角色'" class="w-[400px]">
    <XSkeleton :loading="modelLoad">
      <NForm :rules="rules" ref="nFormRef" :model="model">
        <NFormItem label="ID" v-if="!isAdd">
          <NInputNumber
            class="w-full"
            :disabled="!isAdd"
            v-model:value="model.id"
          />
        </NFormItem>
        <NFormItem label="角色名称" path="name">
          <NInput v-model:value="model.name" />
        </NFormItem>
        <NFormItem label="角色权限码" path="code">
          <NInput :disabled="!isAdd" v-model:value="model.code" />
        </NFormItem>
        <NFormItem label="角色描述" path="description">
          <NInput v-model:value="model.description" />
        </NFormItem>
        <NFormItem label="角色首页" path="homePath">
          <NInput v-model:value="model.homePath" />
        </NFormItem>
        <NFormItem label="查询策略" path="homePath">
          <NSelect
            v-model:value="model.queryStrategy"
            :options="
              getSelectOption(SysDictCodeEnum.SYS_EXECUTE_STRATEGY).value
            "
          />
        </NFormItem>
        <NFormItem label="更新策略" path="homePath">
          <NSelect
            :options="
              getSelectOption(SysDictCodeEnum.SYS_EXECUTE_STRATEGY).value
            "
            v-model:value="model.updateStrategy"
          />
        </NFormItem>

        <NFormItem label="是否启用">
          <NSwitch v-model:value="model.enableStatus" />
        </NFormItem>
        <NFormItem label="权限组" v-model:value="model.menuIdList">
          <NTree
            :data="menuSimpleTreeSelect"
            checkable
            key-field="value"
            v-model:checked-keys="model.menuIdList"
            default-expand-all
          />
        </NFormItem>
      </NForm>
    </XSkeleton>
  </Drawer>
</template>
