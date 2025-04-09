import type { TagProps } from 'naive-ui';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

import type { Ref } from 'vue';

import { ref } from 'vue';

import { defineStore } from 'pinia';

import { detailSysDictByCode } from '#/api/core/system/dict';
import { SysDictValueTypeEnum } from '#/views/_system/dict/const';

// 定义 DictCache 接口
export interface DictCache {
  dictCode?: string;
  itemClass?: string;
  label: string;
  orderNum?: number;
  style?: 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';
  value: number | string;
  type?: number;
}

export type TagPropsType = Record<
  number | string,
  Partial<TagProps & { value: number | string }> & { text: string }
>;

export const useDictStore = defineStore('system-dict', () => {
  const dictCacheStore = new Map<string, Ref<DictCache[]>>();
  const selectOptionStore = new Map<string, Ref<SelectMixedOption[]>>();
  const tagPropsStore = new Map<string, Ref<TagPropsType>>();

  // 处理字典数据，确保类型正确
  const processDictItem = (item: DictCache): DictCache => ({
    ...item,
    value:
      item.type === SysDictValueTypeEnum.Number
        ? Number(item.value)
        : item.value,
  });

  // 获取字典数据
  const fetchDictData = (dictCode: string): Ref<DictCache[]> => {
    if (dictCacheStore.has(dictCode)) {
      return dictCacheStore.get(dictCode) as Ref<DictCache[]>;
    }

    const dictDataRef = ref<DictCache[]>([]);
    const selectOptionRef = ref<SelectMixedOption[]>([]);
    const tagPropsRef = ref<TagPropsType>({});

    dictCacheStore.set(dictCode, dictDataRef);
    selectOptionStore.set(dictCode, selectOptionRef);
    tagPropsStore.set(dictCode, tagPropsRef);

    // 发起请求并处理数据
    detailSysDictByCode(dictCode)
      .then(({ children }) => {
        const processedChildren = children.map((element) =>
          processDictItem(element),
        );

        dictDataRef.value = processedChildren;
        selectOptionRef.value = processedChildren.map((item) => ({
          label: item.label,
          value: item.value,
        }));
        const tagProps: TagPropsType = {};
        for (const item of processedChildren) {
          tagProps[item.value] = {
            ...item,
            text: item.label,
            type: item.style,
          };
        }

        tagPropsRef.value = tagProps;
      })
      .catch((error) => {
        console.error(`Failed to fetch dict data for code: ${dictCode}`, error);
      });

    return dictDataRef;
  };

  // 获取字典数据
  const getDictData = (dictCode: string): Ref<DictCache[]> => {
    return dictCacheStore.get(dictCode) || fetchDictData(dictCode);
  };

  // 获取选择项
  const getSelectOption = (dictCode: string): Ref<SelectMixedOption[]> => {
    if (!selectOptionStore.has(dictCode)) {
      fetchDictData(dictCode);
    }
    return selectOptionStore.get(dictCode) as Ref<SelectMixedOption[]>;
  };

  // 获取标签渲染属性
  const getTagRenderProps = (dictCode: string): Ref<TagPropsType> => {
    if (!tagPropsStore.has(dictCode)) {
      fetchDictData(dictCode);
    }
    return tagPropsStore.get(dictCode) as Ref<TagPropsType>;
  };

  function $reset() {
    dictCacheStore.clear();
    selectOptionStore.clear();
    tagPropsStore.clear();
  }
  return {
    $reset,
    getSelectOption,
    getDictData,
    getTagRenderProps,
  };
});
