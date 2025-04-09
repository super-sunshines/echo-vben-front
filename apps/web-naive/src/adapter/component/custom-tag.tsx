import type {
  VxeGlobalRendererHandles,
  VxeGlobalRendererOptions,
} from '@vben/plugins/vxe-table';

import { NTag } from 'naive-ui';

export const CellCustomTagVxeGlobalRendererOptions: VxeGlobalRendererOptions = {
  renderTableDefault(
    renderOpts: VxeGlobalRendererHandles.RenderTableDefaultOptions,
    params: VxeGlobalRendererHandles.RenderTableDefaultParams<any>,
  ) {
    const { props } = renderOpts;
    const { row } = params;
    const valueKey = props?.valueKey ?? 'value';
    const labelKey = props?.labelKey ?? 'label';
    const thisSelectOptions = props?.options.value ?? props?.options;

    // 将 thisSelectOptions 转换为 Map 以提高查找效率
    const selectOptionsMap = new Map(
      thisSelectOptions.map((item: any) => [item[valueKey], item]),
    );

    let showString = '';
    const fieldValue = row[params.column.field];
    if (Array.isArray(fieldValue)) {
      const showStringArray = fieldValue.map((itemCode: string) => {
        const option: any = selectOptionsMap.get(itemCode) ?? {
          [labelKey]: '',
          [valueKey]: '',
        };
        return option[labelKey];
      });
      showString = showStringArray.join(',');
    } else if (fieldValue !== undefined && fieldValue !== null) {
      const option: any = selectOptionsMap.get(fieldValue) ?? {
        [labelKey]: '',
        [valueKey]: '',
      };
      showString = option[labelKey];
    }
    return (
      <NTag size="small" type="primary">
        {showString === '' ? '无' : showString}
      </NTag>
    );
  },
};
