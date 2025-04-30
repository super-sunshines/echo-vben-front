<script setup lang="tsx">
import type { DataTableColumns, PaginationProps } from 'naive-ui';

import type { SysDictApi } from '#/api/core/system/dict';

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';

import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NInputNumber,
  NPopconfirm,
  NSelect,
  NSpace,
} from 'naive-ui';

import { message } from '#/adapter/naive';
import {
  deleteSysDict,
  detailSysDictByCode,
  pageListSysDictChild,
  updateSysDictChild,
} from '#/api/core/system/dict';

import { SysDictStyleType, SysDictValueTypeEnum } from '../const';

interface RowData extends SysDictApi.SysDictChildRecord {}
const dictDataChildren = ref<RowData[]>([]);
const dictData = ref<SysDictApi.SysDictRecord>();
const dictCode = ref('');
const route = useRoute();

const createColumns: DataTableColumns<RowData> = [
  {
    title: '标签',
    key: 'label',
    width: 250,
    render(row, index) {
      return (
        <NInput
          onUpdateValue={(value) =>
            dictDataChildren.value[index] &&
            (dictDataChildren.value[index].label = value)
          }
          size={'small'}
          value={row.label}
        ></NInput>
      );
    },
  },
  {
    title: '标签样式',
    key: 'type',
    width: 150,
    render(row, index) {
      return (
        <NSelect
          onUpdateValue={(value) =>
            dictDataChildren.value[index] &&
            (dictDataChildren.value[index].style = value)
          }
          options={SysDictStyleType}
          size={'small'}
          value={row.style}
        ></NSelect>
      );
    },
  },

  {
    title: '字典值',
    key: 'dictCode',
    width: 250,
    render(row, index) {
      return dictData.value?.valueType === SysDictValueTypeEnum.Number ? (
        <NInputNumber
          min={1}
          onUpdateValue={(value) => {
            const regExp = new RegExp(dictData.value?.regular as string);
            if (!regExp.test(`${value}`)) {
              message.error('字典值正则匹配不符合');
              return;
            }
            dictDataChildren.value[index] &&
              (dictDataChildren.value[index].value = `${value}`);
          }}
          size={'small'}
          value={Number(row.value)}
        ></NInputNumber>
      ) : (
        <NInput
          onUpdateValue={(value) => {
            const regExp = new RegExp(dictData.value?.regular as string);
            if (!regExp.test(`${value}`)) {
              message.error('字典值正则匹配不符合');
            }
          }}
          size={'small'}
          value={`${row.value}`}
        ></NInput>
      );
    },
  },
  {
    title: '排序',
    width: 200,
    key: 'orderNum',
    render(row, index) {
      return (
        <NInputNumber
          onUpdateValue={(value) => {
            dictDataChildren.value[index] &&
              (dictDataChildren.value[index].orderNum = Number(value));
            setTimeout(() => {
              dictDataChildren.value.sort((a, b) => a.orderNum - b.orderNum);
            }, 300);
          }}
          size={'small'}
          value={row.orderNum}
        ></NInputNumber>
      );
    },
  },
  {
    title: '描述',
    key: 'describe',
    minWidth: 400,
    render(row, index) {
      return (
        <NInput
          onUpdateValue={(value) =>
            dictDataChildren.value[index] &&
            (dictDataChildren.value[index].describe = value)
          }
          size={'small'}
          value={row.describe}
        ></NInput>
      );
    },
  },
  {
    title: '操作',
    width: 150,
    fixed: 'right',
    align: 'center',
    key: 'orderNum',
    render(row, index) {
      return (
        <NSpace align={'center'} class={'w-full'} justify="center">
          {/* 插入 */}
          <NButton
            circle
            onClick={() => {
              // 在这里插入新元素
              dictDataChildren.value.splice(index + 1, 0, {
                dictCode: '',
                id: 0,
                itemClass: '',
                label: '',
                orderNum: row.orderNum + 1,
                style: 'default',
                type: Number(dictData.value?.valueType),
                value: '',
                describe: '',
              }); // 在索引后插入新元素
            }}
            tertiary={true}
            type={'success'}
          >
            {{
              icon: () => (
                <IconifyIcon
                  class={'-rotate-180'}
                  icon={'carbon:rotate-clockwise'}
                ></IconifyIcon>
              ),
            }}
          </NButton>
          {/* 删除 */}
          <NButton
            circle
            onClick={() => {
              dictDataChildren.value.splice(index, 1);
            }}
            tertiary={true}
            type={'error'}
          >
            {{
              icon: () => <IconifyIcon icon={'carbon:trash-can'}></IconifyIcon>,
            }}
          </NButton>
        </NSpace>
      );
    },
  },
];
onMounted(() => {
  dictCode.value = route.query.code as string;
});

const insertOne = () => {
  // 在这里插入新元素
  dictDataChildren.value.splice(0, 0, {
    dictCode: '',
    id: 0,
    itemClass: '',
    label: '',
    orderNum: 0,
    style: 'default',
    type: Number(dictData.value?.valueType),
    value: '',
    describe: '',
  }); // 在索引后插入新元素
};

const pagination = ref<PaginationProps>({
  page: 1,
  pageSize: 200,
  pageSizes: [10, 20, 30, 40, 100, 200, 500],
  showSizePicker: true,
  showQuickJumper: true,
  onChange(page) {
    pagination.value.page = page;
    fetchModelInfo();
  },
  onUpdatePageSize(pageSize) {
    pagination.value.pageSize = pageSize;
    fetchModelInfo();
  },
});

const fetchModelInfo = async () => {
  message.loading('加载中...');
  pageListSysDictChild({
    page: pagination.value.page as number,
    pageSize: pagination.value.pageSize as number,
    dictCode: dictCode.value,
  }).then(({ items }) => {
    dictDataChildren.value = items;
    message.destroyAll();
    message.success('加载成功');
  });
};

const updateModel = () => {
  for (let i = 0; i < dictDataChildren.value.length; i++) {
    const dictItem = dictDataChildren.value[i];
    if (dictItem?.label === '' || dictItem?.value === '') {
      message.error(`第${i + 1}行标签或值不能为空`);
      return;
    }
  }
  message.loading('更新中...');
  updateSysDictChild(dictCode.value, dictDataChildren.value)
    .then(() => {
      message.destroyAll();
      message.success('更新成功');
      fetchModelInfo();
    })
    .catch((error) => {
      message.destroyAll();
      message.error(error);
    });
};
const router = useRouter();
const { closeCurrentTab } = useTabs();
const deleteModel = () => {
  message.loading('删除中...');
  if (dictData.value) {
    deleteSysDict([dictData.value.id])
      .then(() => {
        message.destroyAll();
        message.success('删除成功');
        closeCurrentTab();
        router.replace({
          path: '/system/dict',
        });
      })
      .catch((error) => {
        message.destroyAll();
        message.error(error);
      });
  }
};

onMounted(() => {
  detailSysDictByCode(dictCode.value).then((res) => (dictData.value = res));
});

watch(
  () => dictCode.value,
  async () => fetchModelInfo(),
);
</script>
<template>
  <Page title="字典值管理" auto-content-height description="对字典的值进行管理">
    <NCard class="h-full overflow-auto">
      <template #header>
        <span class="text-lg font-bold">
          字典
          <span class="text-red-500">[{{ dictData?.name }}]</span>
          详情管理
        </span>
      </template>
      <template #header-extra>
        <NSpace>
          <NPopconfirm @positive-click="deleteModel">
            <template #trigger>
              <NButton type="error">删除</NButton>
            </template>
            请谨慎删除字典有可能会导致系统崩溃！
          </NPopconfirm>
          <NButton type="primary" @click="fetchModelInfo">刷新</NButton>
          <NButton type="info" @click="insertOne">插入</NButton>
          <NButton type="success" @click="updateModel">保存</NButton>
        </NSpace>
      </template>
      <NDataTable
        class="h-full"
        :columns="createColumns"
        :data="dictDataChildren"
        :pagination="pagination"
      />
    </NCard>
  </Page>
</template>
