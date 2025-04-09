<script lang="tsx" setup>
import type { SysDepartmentApi } from '#/api';

import { ref } from 'vue';

import { NCard, NTree, treeProps } from 'naive-ui';

import { message } from '#/adapter/naive';
import { treeListSysDepartment } from '#/api';
import useBoolean from '#/hook/use-boolean';

interface RowData extends SysDepartmentApi.SysDepartmentRecord {}

defineOptions({
  name: 'SysDepartmentTree',
});
const props = defineProps(treeProps);
const { bool: dataLoad, setBool: setDataLoad } = useBoolean();
const { bool: defaultExpandAll, setBool: setDefaultExpandAll } = useBoolean();

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
initModelTreeList();
</script>
<template>
  <div
    :style="{ minWidth: '200px' }"
    class="border-border bg-card mr-2 h-full rounded-[var(--radius)] border p-2"
  >
    <NCard class="h-full" title="所有组织">
      <NTree
        v-if="defaultExpandAll"
        v-bind="props"
        :loading="dataLoad"
        :default-expand-all="defaultExpandAll"
        :data="data"
        key-field="id"
        label-field="name"
        :cancelable="false"
        show-line
        :get-children="
          (node) => (node.children?.length > 0 ? node.children : null)
        "
      />
    </NCard>
  </div>
</template>
