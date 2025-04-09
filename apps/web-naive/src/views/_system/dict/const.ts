import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

export enum SysDictValueTypeEnum {
  Number = 1,
  String = 2,
}

// "default" | "success" | "error" | "warning" | "info" | "primary"
export const SysDictValueType: SelectMixedOption[] = [
  { label: '数值', value: SysDictValueTypeEnum.Number },
  { label: '字符串', value: SysDictValueTypeEnum.String },
];

// "default" | "success" | "error" | "warning" | "info" | "primary"
export const SysDictStyleType: SelectMixedOption[] = [
  { label: '默认', value: 'default' },
  { label: '成功', value: 'success' },
  { label: '错误', value: 'error' },
  { label: '警告', value: 'warning' },
  { label: '信息', value: 'info' },
  { label: '主要', value: 'primary' },
];
