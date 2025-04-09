import type { TagPropsType } from './tag';

export const iconSelectCollectionOptions = [
  {
    label: '本地SVG',
    value: 'svg',
  },
  {
    label: 'Carbon',
    value: 'carbon',
  },
];

/**
 * Menu Type
 */
export enum MenuType {
  // MenuTypeApi 接口
  Api = 0,
  // MenuTypeMenu 菜单
  Menu = 1,
  // MenuTypeCatalogue 目录
  Catalogue = 2,
  // MenuTypeIframe 内嵌网页
  Iframe = 3,
  // MenuTypeLink 外联
  Link = 4,
}

export const SysMenuTypeNoApiTagProp: TagPropsType = {
  [MenuType.Menu]: { text: '菜单', type: 'info', value: MenuType.Menu },
  [MenuType.Catalogue]: {
    text: '目录',
    type: 'primary',
    value: MenuType.Catalogue,
  },
  [MenuType.Iframe]: {
    text: '内嵌网页',
    type: 'info',
    value: MenuType.Iframe,
  },
  [MenuType.Link]: { text: '外链', type: 'info', value: MenuType.Link },
};
export const SysMenuTypeTagProp: TagPropsType = {
  [MenuType.Api]: { text: '接口', type: 'error', value: MenuType.Api },
  ...SysMenuTypeNoApiTagProp,
};

export const SysMenuTypeNoApiTagPropKeys = Object.keys(
  SysMenuTypeNoApiTagProp,
).map(Number);

export const SysDisableTagProp: TagPropsType = {
  1: { text: '正常', type: 'success' },
  2: { text: '封禁', type: 'warning' },
};
export const SysUserTagProp: TagPropsType = {
  1: { text: '正常', type: 'success' },
  2: { text: '封禁', type: 'warning' },
};
