import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { NButton, NImage } from 'naive-ui';

import {
  CellCustomTagVxeGlobalRendererOptions,
  CellDictTagVxeGlobalRendererOptions,
  installNaivePluginRenderNaive,
} from './component';
import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: async (vxeUI) => {
    installNaivePluginRenderNaive(vxeUI);
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return h(NImage, { src: row[column.field] });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          NButton,
          { size: 'small', type: 'primary', quaternary: true },
          { default: () => props?.text },
        );
      },
    });
    // CellDictTag: { name: 'CellDictTag' },
    /**
     * @description 字典标签渲染器
     * @props code 字典编码
     */
    vxeUI.renderer.add('CellDictTag', CellDictTagVxeGlobalRendererOptions);

    // 表格配置项可以用 CellTag: { name: 'CellTag' },

    /**
     * @description 标签渲染器
     * @props valueKey @default "value" 值Key
     * @props labelKey @default "label"  标签key
     * @props options 数组选项
     */
    vxeUI.renderer.add('CellTag', CellCustomTagVxeGlobalRendererOptions);

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
