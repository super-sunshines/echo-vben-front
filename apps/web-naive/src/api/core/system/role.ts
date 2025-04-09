import { requestClient } from '#/api/request';

export namespace SysRoleApi {
  export interface RolePageParam extends ApiPageParam {}

  export interface RoleRecord {
    name: string;
    /**
     * 权限代码
     */
    code?: string;
    /**
     * 权限描述
     */
    description?: string;
    /**
     * 启用状态
     */
    enableStatus?: boolean;
    /**
     * 主页目录
     */
    homePath?: string;
    /**
     * 主键
     */
    id?: number;

    /**
     * 查询策略·
     */
    queryStrategy: number;
    /**
     * 更新策略
     */
    updateStrategy: number;
    menuIdList: number[];
  }
}

/**
 * 获取系统角色列表
 */
export async function getSysRolePageList(params: SysRoleApi.RolePageParam) {
  return requestClient.get<ApiPageResult<SysRoleApi.RoleRecord>>(
    '/system/role/list',
    {
      params,
    },
  );
}

/**
 * 角色详情
 */
export async function detailSysRole(id: number) {
  return requestClient.get<SysRoleApi.RoleRecord>(`/system/role/${id}`);
}

/**
 * 新增角色
 */
export async function addSysRole(data: SysRoleApi.RoleRecord) {
  return requestClient.post<SysRoleApi.RoleRecord>(`/system/role`, data);
}
/**
 * 修改角色
 */
export async function updateSysRole(id: number, data: SysRoleApi.RoleRecord) {
  return requestClient.put<SysRoleApi.RoleRecord>(`/system/role/${id}`, data);
}
