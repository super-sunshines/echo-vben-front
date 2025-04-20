import type { Ref } from 'vue';

import type { TagPropsType } from '#/store';

import { isRef } from 'vue';

import dayjs from 'dayjs';
import { NSpace, NTag } from 'naive-ui';

export const NTimeFormatRender = (row: any, column: string) => {
  const time = row[column];
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '';
};

export interface RenderTagOptions {
  value: (number | string)[] | (number | string) | undefined;
  valueKey?: string;
  labelKey?: string;
  options?: Array<Record<string, any>> | Ref<Array<Record<string, any>>>;
  multiple?: boolean;
  tagProps?: TagPropsType;
  needCoverProps?: boolean;
  coverTagProps?: Record<string, any>;
  nullText?: string;
}

export const NTagRender = ({
  value,
  valueKey = 'value',
  labelKey = 'label',
  options = [],
  multiple = false,
  tagProps = {},
  needCoverProps = false,
  coverTagProps = {},
  nullText = '-',
}: RenderTagOptions) => {
  const thisSelectOptions = isRef(options) ? options.value : options;

  let filterList = [];
  const selectOptionsMap = new Map(
    thisSelectOptions.map((item: any) => [item[valueKey], item]),
  );

  if (Array.isArray(value)) {
    filterList = value.map((itemCode: number | string) => {
      const option = selectOptionsMap.get(itemCode) ?? {
        [labelKey]: '',
        [valueKey]: '',
      };
      return option[labelKey];
    });
  } else if (value !== undefined && value !== null) {
    const option = selectOptionsMap.get(value) ?? {
      [labelKey]: '',
      [valueKey]: '',
    };
    const props = value ? tagProps[value] : {};
    return (
      <NTag {...(needCoverProps ? coverTagProps : props)}>
        {option[labelKey]}
      </NTag>
    );
  }
  if (filterList.length === 0) {
    return <NTag>{nullText}</NTag>;
  }

  return multiple ? (
    <NSpace>
      {filterList.map((item: string, index: number) => {
        const key = Array.isArray(value) ? value[index] : value;
        const props =
          key === undefined ? {} : tagProps[key as number | string] || {};
        return (
          <NTag key={index} {...(needCoverProps ? coverTagProps : props)}>
            {item}
          </NTag>
        );
      })}
    </NSpace>
  ) : (
    <NTag {...(needCoverProps ? coverTagProps : {})}>
      {filterList.join(',')}
    </NTag>
  );
};
