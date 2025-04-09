import { requestClient } from '#/api/request';
import type { RouteRecordStringComponent } from '@vben/types';

export namespace SysMenuApi {
  export interface Meta {
    /**
     * 组件地址
     */
    activeIcon?: string;
    /**
     * 激活的菜单
     */
    activePath?: string;
    /**
     * 固定标签
     */
    affixTab?: boolean;
    /**
     * 固定标签排序
     */
    affixTabOrder?: number;
    /**
     * 权限代码数组
     */
    authority?: string[];
    /**
     * 创建者
     */
    createBy?: string;
    /**
     * 创建部门
     */
    createDept?: string;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 删除时间
     */
    deleteTime?: string;
    /**
     * 子菜单隐藏
     */
    hideChildrenInMenu?: boolean;
    /**
     * 面包屑中隐藏
     */
    hideInBreadcrumb?: boolean;
    /**
     * 隐藏菜单
     */
    hideInMenu?: boolean;
    /**
     * 标签页隐藏
     */
    hideInTab?: boolean;
    /**
     * 访问路径
     */
    icon?: string;
    /**
     * id
     */
    id?: number;
    /**
     * 内嵌iframe地址
     */
    iframeSrc?: string;
    /**
     * 忽略权限
     */
    ignoreAccess: boolean;
    /**
     * 跳转打开地址
     */
    link?: string;

    /**
     * 基础布局
     */
    noBasicLayout?: boolean;
    /**
     * 在新窗口打开
     */
    openInNewWindow?: boolean;
    /**
     * 排序
     */
    order?: number;
    /**
     * 路由名称
     */
    title?: string;
    /**
     * 更新者
     */
    updateBy?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
  }
  export interface SysMenuRecord {
    /**
     * 接口代码
     */
    apiCode: string;
    /**
     * 接口描述
     */
    apiDescription: string;
    type: number;
    id: number;
    pid: number;
    name: string;
    path: string;
    component: string;
    children?: Array<SysMenuRecord>;
    meta: Meta;
  }

  export interface SimpleMenuBo {
    includeTopLevel?: boolean;
    includePermissions?: boolean;
  }
  export interface SimpleMenuVo {
    children?: SimpleMenuVo[];
    label?: string;
    value?: number;
  }

  export interface ApiCodeBo {
    code?: string;
    description?: string;
    pid?: number;
  }
}
export async function getSysMenuSimpleList(params?: SysMenuApi.SimpleMenuBo) {
  return requestClient.get<SysMenuApi.SimpleMenuVo[]>('/system/menu/simple', {
    params,
  });
}

/**
 * 获取系统目录管理列表
 */
export async function getSysMenuList() {
  return requestClient.get<SysMenuApi.SysMenuRecord[]>('/system/menu/list');
}

/**
 * 系统目录详细
 */
export async function detailSysMenu(id: number) {
  return requestClient.get<SysMenuApi.SysMenuRecord>(`/system/menu/${id}`);
}

/**
 * 新增一个目录
 */
export async function addSysMenu(data: SysMenuApi.SysMenuRecord) {
  return requestClient.post<number>('/system/menu', data);
}

/**
 * 修改目录
 */
export async function updateSysMenu(
  id: number,
  data: Record<any, any> | SysMenuApi.SysMenuRecord,
) {
  return requestClient.put<number>(`/system/menu/${id}`, data);
}

/**
 * 删除目录
 */
export async function deleteSysMenu(ids: number[]) {
  return requestClient.delete<number>('/system/menu', { params: { ids } });
}

/**
 * 新的Code
 */
export async function getNewCodes() {
  return requestClient.get<string[]>('/system/menu/new/codes');
}

/**
 * 添加Code
 */
export async function addNewCodes(list: SysMenuApi.ApiCodeBo[]) {
  return requestClient.post<boolean>('/system/menu/code', { list });
}
/**
 * 编辑Code
 */
export async function editCodes(id: number, data: SysMenuApi.ApiCodeBo) {
  return requestClient.put<boolean>(`/system/menu/code/${id}`, data);
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}
