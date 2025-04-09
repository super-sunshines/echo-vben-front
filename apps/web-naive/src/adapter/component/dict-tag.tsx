import type {
  VxeGlobalRendererHandles,
  VxeGlobalRendererOptions,
} from '@vben/plugins/vxe-table';

import { NTag } from 'naive-ui';

import { useDictStore } from '#/store';

export const CellDictTagVxeGlobalRendererOptions: VxeGlobalRendererOptions = {
  renderTableDefault(
    renderOpts: VxeGlobalRendererHandles.RenderTableDefaultOptions,
    params: VxeGlobalRendererHandles.RenderTableDefaultParams<any>,
  ) {
    const { getTagRenderProps } = useDictStore();
    const { props } = renderOpts;
    const { row, column } = params;
    const cellValue = row[column.field];
    const tagProps = getTagRenderProps(props?.code);
    return (
      <NTag {...tagProps.value[cellValue]}>
        {tagProps.value[cellValue]?.text ?? '无'}
      </NTag>
    );
  },
};
