<script lang="tsx" setup>
import type { FormRules } from 'naive-ui';

import type { SysMenuApi } from '#/api/core/system/menu';

import { computed, defineComponent, ref, watch } from 'vue';

import { IconPicker, useVbenDrawer } from '@vben/common-ui';

import {
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSwitch,
  NTreeSelect,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import {
  addSysMenu,
  detailSysMenu,
  getSysMenuSimpleList,
  updateSysMenu,
} from '#/api/core/system/menu';
import XSkeleton from '#/components/XSkeleton.vue';
import {
  iconSelectCollectionOptions,
  MenuType,
  SysMenuTypeNoApiTagProp,
} from '#/constants';
import useBoolean from '#/hook/use-boolean';
import { useComponentRef } from '#/hook/use-component-ref';
// 定义emit事件及其参数类型
const emit = defineEmits<{
  (event: 'update:success'): void;
}>();
const model = ref<SysMenuApi.SysMenuRecord>({
  pid: 0,
  name: '',
  type: 1,
  path: '',
  component: '',
  meta: {
    title: '你好',
    icon: '',
    order: 0,
    activeIcon: '',
    hideInMenu: false,
    hideInTab: false,
    hideInBreadcrumb: false,
    hideChildrenInMenu: false,
    authority: [],
    activePath: '',
    affixTab: false,
    affixTabOrder: 0,
    iframeSrc: '',
    ignoreAccess: true,
    link: '',
    openInNewWindow: false,
    noBasicLayout: false,
  },
  apiCode: '',
  apiDescription: '',
  id: 0,
});
const { bool: modelLoad, setBool: setModelLoad } = useBoolean(false);
const operateId = ref(0);
const isAdd = computed(() => operateId.value === 0);

const rules: FormRules = {};
const indexVueFiles = Object.keys(
  import.meta.glob('/src/views/**/**.vue', {
    eager: true,
  }),
)
  .filter((i) => (import.meta.env.PROD ? !i.includes('/_') : true))
  .map((i) => {
    return {
      label: i.replaceAll('/src', ''),
      value: i.replaceAll('/src', ''),
    };
  });

const resetModel = () => {
  model.value = {
    apiCode: '',
    apiDescription: '',
    type: 1,
    id: 0,
    pid: 0,
    name: '',
    path: '',
    component: '',
    meta: {
      title: '',
      icon: '',
      order: 0,
      activeIcon: '',
      hideInMenu: false,
      hideInTab: false,
      hideInBreadcrumb: false,
      hideChildrenInMenu: false,
      authority: [],
      activePath: '',
      affixTab: false,
      affixTabOrder: 0,
      iframeSrc: '',
      ignoreAccess: true,
      link: '',
      openInNewWindow: false,
      noBasicLayout: false,
    },
  };
};

watch(
  () => model.value.type,
  (type) => {
    const defaults = {
      [MenuType.Catalogue]: () => {
        model.value.component = '';
        model.value.meta.link = '';
        model.value.meta.iframeSrc = '';
      },
      [MenuType.Iframe]: () => {
        model.value.component = 'iframeSrc';
        model.value.meta.link = '';
      },
      [MenuType.Link]: () => {
        model.value.component = '';
        model.value.meta.iframeSrc = '';
      },
      [MenuType.Menu]: () => {
        model.value.meta.link = '';
        model.value.meta.iframeSrc = '';
      },
    };
    const resetValues = defaults[type as keyof typeof defaults];
    if (resetValues) {
      resetValues();
    }
  },
);

const formRef = useComponentRef(NForm);

function fetchModelInfo() {
  detailSysMenu(operateId.value)
    .then((res) => {
      model.value = res;
    })
    .then(() => setModelLoad(false));
}

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => onSubmit(model.value),
});
function onSubmit(values: any | Record<string, any>) {
  message.loading('数据提交中请稍后！');
  if (isAdd.value) {
    addSysMenu(values)
      .then(() => {
        drawerApi.close();
        emit('update:success');
      })
      .finally(() => {
        message.destroyAll();
      });
  } else {
    updateSysMenu(operateId.value, values)
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

const iconSelectCollection = ref('carbon');
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
const onMenuPathChange = (path: string) => {
  model.value.name = path
    .split('/')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
};
const menuSimpleTreeSelect = ref<SysMenuApi.SimpleMenuVo[]>([]);
const initSimpleMenuTree = () => {
  getSysMenuSimpleList({ includeTopLevel: true }).then((res) => {
    menuSimpleTreeSelect.value = res;
  });
};
initSimpleMenuTree();

defineComponent({ name: 'SysMenuOperate' });
</script>

<template>
  <Drawer :title="isAdd ? '新增目录' : '编辑目录'" class="w-[600px]">
    <XSkeleton :loading="modelLoad">
      <NForm ref="formRef" :model="model" :rules="rules" label-width="100">
        <NGrid :cols="24" :x-gap="24">
          <NFormItemGi v-if="!isAdd" :span="24" label="ID" path="user.name">
            <NInputNumber
              v-model:value="model.id"
              :disabled="!isAdd"
              class="w-full"
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="选择类型">
            <NRadioGroup v-model:value="model.type" size="large" class="w-full">
              <NRadioButton
                v-for="(item, index) in SysMenuTypeNoApiTagProp"
                :key="index"
                :value="item.value"
                :label="item.text"
              />
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi :span="24" label="父目录" path="user.age">
            <NTreeSelect
              v-model:value="model.pid"
              key-field="value"
              placeholder="父目录"
              :options="menuSimpleTreeSelect"
            />
          </NFormItemGi>
          <NFormItemGi :span="12" label="目录名称" path="user.phone">
            <NInput v-model:value="model.meta.title" placeholder="目录名称" />
          </NFormItemGi>
          <NFormItemGi :span="12" label="排序" path="user.phone">
            <NInputNumber v-model:value="model.meta.order" class="w-full" />
          </NFormItemGi>
          <NFormItemGi :span="24" label="地址栏" path="user.phone">
            <NInput
              v-model:value="model.path"
              :on-input="onMenuPathChange"
              placeholder="地址栏"
            />
          </NFormItemGi>
          <NFormItemGi :span="24" label="菜单名称" path="user.phone">
            <NInput v-model:value="model.name" placeholder="菜单名称" />
          </NFormItemGi>
          <NFormItemGi :span="8" label="图标集" path="user.phone">
            <NSelect
              v-model:value="iconSelectCollection"
              :options="iconSelectCollectionOptions"
            />
          </NFormItemGi>
          <NFormItemGi :span="8" label="菜单图标" path="user.phone">
            <IconPicker
              v-model="model.meta.icon"
              :prefix="iconSelectCollection"
            />
          </NFormItemGi>
          <NFormItemGi :span="8" label="选中时的图标" path="user.phone">
            <IconPicker
              v-model="model.meta.activeIcon"
              :prefix="iconSelectCollection"
            />
          </NFormItemGi>
          <NFormItemGi
            :span="24"
            label="组件地址"
            v-if="model.type === MenuType.Menu"
          >
            <NSelect
              clearable
              :options="indexVueFiles"
              filterable
              v-model:value="model.component"
              placeholder="地址栏"
            />
          </NFormItemGi>
          <NFormItemGi
            :span="24"
            label="内嵌iframe地址"
            v-if="model.type === MenuType.Iframe"
          >
            <NInput v-model:value="model.meta.iframeSrc" />
          </NFormItemGi>
          <NFormItemGi
            :span="24"
            label="外链网页(http[s]://)"
            v-if="model.type === MenuType.Link"
          >
            <NInput v-model:value="model.meta.link" />
          </NFormItemGi>
          <NFormItemGi
            :span="8"
            label="基础布局"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch
              v-model:value="model.meta.noBasicLayout"
              :checked-value="false"
              :unchecked-value="true"
            />
          </NFormItemGi>
          <NFormItemGi
            :span="8"
            label="隐藏菜单"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch v-model:value="model.meta.hideInMenu" />
          </NFormItemGi>

          <NFormItemGi
            :span="8"
            label="新窗口打开"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch v-model:value="model.meta.openInNewWindow" />
          </NFormItemGi>
          <NFormItemGi
            :span="8"
            label="Tab隐藏"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch v-model:value="model.meta.hideInTab" />
          </NFormItemGi>

          <NFormItemGi
            :span="16"
            label="子菜单隐藏"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch v-model:value="model.meta.hideChildrenInMenu" />
          </NFormItemGi>
          <NFormItemGi
            :span="model.meta.ignoreAccess ? 24 : 8"
            label="可见权限"
            label-placement="left"
            path="user.phone"
          >
            <NSwitch
              :checked-value="false"
              :unchecked-value="true"
              v-model:value="model.meta.ignoreAccess"
            />
          </NFormItemGi>
          <NFormItemGi
            v-if="!model.meta.ignoreAccess"
            v-show="!model.meta.ignoreAccess"
            :span="16"
            label="显示权限组"
            label-placement="left"
            path="user.phone"
          >
            <NSelect v-model:value="model.meta.authority" multiple />
          </NFormItemGi>

          <NFormItemGi
            :span="model.meta.affixTab ? 8 : 24"
            label="Tab固定"
            label-placement="left"
            path="user.phone"
          >
            <NFormItemGi :span="16" label-placement="left" path="user.phone">
              <NSwitch v-model:value="model.meta.affixTab" />
            </NFormItemGi>
          </NFormItemGi>
          <NFormItemGi
            v-if="model.meta.affixTab"
            :span="16"
            label="Tab固定排序"
            label-placement="left"
            path="user.phone"
          >
            <NInputNumber
              v-model:value="model.meta.affixTabOrder"
              class="w-full"
              multiple
            />
          </NFormItemGi>
        </NGrid>
      </NForm>
    </XSkeleton>
  </Drawer>
</template>
