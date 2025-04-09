<script lang="tsx" setup>
import type { BaseFormComponentType, VbenFormProps } from '@vben/common-ui';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  addSysDepartment,
  detailSysDepartment,
  updateSysDepartment,
  type SysDepartmentApi,
} from '#/api';
import { XSkeleton } from '#/components';
import useBoolean from '#/hook/use-boolean';

const operateId = ref(0);

const isAdd = computed(() => operateId.value === 0);
const { bool: drawerVis, setBool: setDrawerVis } = useBoolean();
const { bool: xSkeletonShow, setBool: setXSkeletonShow } = useBoolean();
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: onSubmit,
});

const props = withDefaults(
  defineProps<{
    departmentTree: Array<SysDepartmentApi.SysDepartmentRecord>;
  }>(),
  {
    departmentTree: () => [],
  },
);

const emit = defineEmits(['submit']);

const resetModel = (pid: number) => {
  formApi.setValues(
    {
      id: 0,
      name: '',
      pid: pid,
      orderNum: 0,
      description: '',
    },
    false,
  );
};
const fetchModelInfo = () => {
  setXSkeletonShow(true);
  detailSysDepartment(operateId.value)
    .then((res) => {
      formApi.setValues(res, false);
    })
    .finally(() => {
      setXSkeletonShow(false);
    });
};

function add(pid?: number) {
  pid = Number(pid);
  operateId.value = 0;
  resetModel(pid);
  drawerApi.open();
}

function edit(id?: number) {
  operateId.value = Number(id);
  fetchModelInfo();
  drawerApi.open();
}
defineExpose({
  add,
  edit,
});
async function onSubmit() {
  formApi.validateAndSubmitForm();
  message.loading('数据提交中请稍后...');
  const values = await formApi.getValues();
  if (isAdd.value) {
    addSysDepartment(values)
      .then(() => {
        drawerApi.close();
        emit('submit');
      })
      .finally(() => {
        message.destroyAll();
      });
  } else {
    updateSysDepartment(operateId.value, values)
      .then(() => {
        drawerApi.close();
        emit('submit');
      })
      .finally(() => {
        message.destroyAll();
      });
  }
}

const formOptions: VbenFormProps<BaseFormComponentType> = {
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  showDefaultActions: false,
  layout: 'vertical',
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'id',
      label: 'ID',
      dependencies: {
        triggerFields: ['id', 'name'],
        disabled: () => !isAdd.value,
        show: () => !isAdd.value,
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组织名称',
      },
      fieldName: 'name',
      label: '组织名称',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: '上级组织',
        showSearch: true,
        keyField: 'id',
        labelField: 'name',
        getChildren: (node: any) => {
          return node.children?.length > 0 ? node.children : null;
        },
      },
      dependencies: {
        triggerFields: ['pid', 'id'],
        componentProps: () => {
          return {
            options: [...props.departmentTree],
          };
        },
      },
      fieldName: 'pid',
      label: '上级组织',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序',
      },
      fieldName: 'orderNum',
      label: '排序',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入简介',
        type: 'textarea',
      },
      fieldName: 'description',
      label: '描述',
    },
  ],
  wrapperClass: 'grid-cols-1',
};
const [Form, formApi] = useVbenForm(formOptions);
</script>

<template>
  <Drawer v-model="drawerVis" :title="isAdd ? '新增组织' : '编辑组织'">
    <XSkeleton :loading="xSkeletonShow">
      <Form />
    </XSkeleton>
  </Drawer>
</template>
