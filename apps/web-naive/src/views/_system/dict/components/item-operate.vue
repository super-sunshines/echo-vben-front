<script lang="tsx" setup>
import type { SysDictApi } from '#/api/core/system/dict';

import { computed, defineComponent, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  addSysDict,
  detailSysDict,
  updateSysDict,
} from '#/api/core/system/dict';
import XSkeleton from '#/components/XSkeleton.vue';
import { SysDisableTagProp, tagPropToOptions } from '#/constants';
import { SysDictCodeEnum } from '#/constants/dict.enum';
import useBoolean from '#/hook/use-boolean';

import { SysDictValueType } from '../const';

// 定义emit事件及其参数类型
const emit = defineEmits<{
  (event: 'update:success'): void;
}>();

const model = ref<SysDictApi.SysDictRecord>({
  code: '',
  describe: '',
  id: 0,
  module: 0,
  valueType: 1,
  name: '',
  enableStatus: 1,
  children: [],
  regular: '^(100|[1-9][0-9]?)$',
});
const { bool: modelLoad, setBool: setModelLoad } = useBoolean(false);
const operateId = ref(0);
const isAdd = computed(() => operateId.value === 0);

const resetModel = () => {
  model.value = {
    code: '',
    describe: '',
    id: 0,
    valueType: 1,
    module: 0,
    name: '',
    enableStatus: 1,
    children: [],
    regular: '^(100|[1-9][0-9]?)$',
  };
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'name',
      label: '字典名称',
      rules: 'required',
      dependencies: {
        triggerFields: ['name'],
        componentProps: () => {
          return {
            disabled: !isAdd.value,
          };
        },
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'code',
      label: '字典代码',
      rules: 'required',
      dependencies: {
        triggerFields: ['name'],
        componentProps: () => {
          return {
            disabled: !isAdd.value,
          };
        },
      },
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '值类型',
      },

      fieldName: 'valueType',
      label: '字典值类型',
      rules: 'required',
      dependencies: {
        triggerFields: ['valueType'],
        componentProps: () => {
          return {
            disabled: !isAdd.value,
            options: SysDictValueType,
          };
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'regular',
      label: '正则表达式',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        type: 'textarea',
      },
      fieldName: 'describe',
      label: '描述',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: tagPropToOptions(SysDisableTagProp),
      },
      fieldName: 'enableStatus',
      label: '启用状态',
      rules: 'required',
    },
    {
      component: 'DictSelect',
      fieldName: 'module',
      label: '所属模块',
      componentProps: {
        code: SysDictCodeEnum.SYS_DICT_MODULE,
      },
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function fetchModelInfo() {
  detailSysDict(operateId.value)
    .then((res) => {
      model.value = res;
      formApi.setValues(res);
    })
    .then(() => setModelLoad(false));
}

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => formApi.validateAndSubmitForm(),
});
function onSubmit(values: any | Record<string, any>) {
  message.loading('数据提交中请稍后！');
  if (isAdd.value) {
    addSysDict(values)
      .then(() => {
        drawerApi.close();
        emit('update:success');
      })
      .finally(() => {
        message.destroyAll();
      });
  } else {
    updateSysDict(operateId.value, values)
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

defineComponent({ name: 'DictOperate' });
</script>

<template>
  <Drawer :title="isAdd ? '新增字典' : '编辑字典信息'" class="w-[600px]">
    <XSkeleton :loading="modelLoad">
      <Form />
    </XSkeleton>
  </Drawer>
</template>
