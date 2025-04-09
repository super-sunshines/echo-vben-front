<script lang="tsx" setup>
import type { SysDepartmentApi, SysUserApi } from '#/api';
import type { SysRoleApi } from '#/api/core/system/role';

import { computed, defineComponent, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { message } from '#/adapter/naive';
import {
  addSysUser,
  detailSysUser,
  treeListSysDepartment,
  updateSysUser,
} from '#/api';
import { getSysRolePageList } from '#/api/core/system/role';
import XSkeleton from '#/components/XSkeleton.vue';
import { SysDisableTagProp, tagPropToOptions } from '#/constants';
import useBoolean from '#/hook/use-boolean';

// 定义emit事件及其参数类型
const emit = defineEmits<{
  (event: 'update:success'): void;
}>();

const props = defineProps<{
  treeSysDepartment: Array<SysDepartmentApi.SysDepartmentRecord>;
}>();

const model = ref<SysUserApi.SysUserRecord>({
  id: 0,
  username: '',
  nickName: '',
  realName: '',
  roleCodeList: [],
  email: '',
  avatar: '',
  phone: '',
  status: 0,
  lastOnline: 0,
});
const { bool: modelLoad, setBool: setModelLoad } = useBoolean(false);
const operateId = ref(0);
const isAdd = computed(() => operateId.value === 0);

const resetModel = () => {
  model.value = {
    id: 0,
    username: '',
    nickName: '',
    realName: '',
    roleCodeList: [],
    email: '',
    avatar: '',
    phone: '',
    status: 0,
    lastOnline: 0,
  };
};

const roleSelectList = ref<SysRoleApi.RoleRecord[]>([]);

const [Form, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
        disabled: true,
      },
      fieldName: 'username',
      label: '登录账号',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickName',
      label: '昵称',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'realName',
      label: '真实姓名',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z.string().default('默认值').optional(),
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: '所属组织',
        showSearch: true,
        keyField: 'id',
        labelField: 'name',
        getChildren: (node: any) => {
          return node.children?.length > 0 ? node.children : null;
        },
      },
      dependencies: {
        triggerFields: ['departmentId'],
        componentProps: () => {
          return {
            options: [...props.treeSysDepartment],
          };
        },
      },
      fieldName: 'departmentId',
      label: '上级组织',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        options: tagPropToOptions(SysDisableTagProp),
      },
      // 字段名
      fieldName: 'email',
      // 界面显示的label
      label: '邮箱',
      rules: z.string().email('请输入正确的邮箱'),
    },
    {
      component: 'Select',
      // 对应组件的参数
      componentProps: {
        options: tagPropToOptions(SysDisableTagProp),
      },
      fieldName: 'status',
      label: '用户状态',
      rules: 'required',
    },
    {
      component: 'Select',
      // 对应组件的参数
      componentProps: {
        options: roleSelectList,
        multiple: true,
        labelField: 'name',
        valueField: 'code',
      },
      dependencies: {
        triggerFields: ['roleCodeList'],
        componentProps: () => {
          return {
            options: roleSelectList,
          };
        },
      },
      fieldName: 'roleCodeList',
      label: '角色',
      rules: 'selectRequired',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function fetchModelInfo() {
  detailSysUser(operateId.value)
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
    addSysUser(values)
      .then(() => {
        drawerApi.close();
        emit('update:success');
      })
      .finally(() => {
        message.destroyAll();
      });
  } else {
    updateSysUser(operateId.value, values)
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

const initRoleSelect = () => {
  getSysRolePageList({
    page: 1,
    pageSize: 1000,
  }).then(({ items }) => {
    roleSelectList.value = items;
  });
};
initRoleSelect();

defineComponent({ name: 'SysUserOperate' });
</script>

<template>
  <Drawer :title="isAdd ? '新增用户' : '编辑用户'" class="w-[600px]">
    <XSkeleton :loading="modelLoad">
      <Form />
    </XSkeleton>
  </Drawer>
</template>
