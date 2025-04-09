import { requestClient } from '#/api/request';

export namespace SysDepartmentApi {
  export interface SysDepartmentPageParam extends ApiPageParam {}

  export interface SysDepartmentRecord {
    children?: SysDepartmentRecord[];
    /**
     * 创建者
     */
    createBy?: number;
    /**
     * 创建部门
     */
    createDept?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * 删除时间
     */
    deleteTime?: string;
    /**
     * 权限描述
     */
    description?: string;
    /**
     * 主键
     */
    id?: number;
    /**
     * 部门名称
     */
    name?: string;
    /**
     * 父ID
     */
    pid?: number;
    /**
     * 部门状态
     */
    status?: number;
    /**
     * 更新者
     */
    updateBy?: number;
    /**
     * 更新时间
     */
    updateTime?: string;
  }
}

/**
 * 系统组织列表
 */
export async function pageListSysDepartment(
  params: SysDepartmentApi.SysDepartmentPageParam,
) {
  return requestClient.get<ApiPageResult<SysDepartmentApi.SysDepartmentRecord>>(
    '/system/department/list',
    {
      params,
    },
  );
}
/**
 * 树形系统组织列表
 */
export async function treeListSysDepartment() {
  return requestClient.get<Array<SysDepartmentApi.SysDepartmentRecord>>(
    '/system/department/tree',
  );
}

/**
 * 系统组织详情
 */
export async function detailSysDepartment(id: number) {
  return requestClient.get<SysDepartmentApi.SysDepartmentRecord>(
    `/system/department/${id}`,
  );
}

/**
 * 系统组织新增
 */
export async function addSysDepartment(
  data: SysDepartmentApi.SysDepartmentRecord,
) {
  return requestClient.post<SysDepartmentApi.SysDepartmentRecord>(
    `/system/department`,
    data,
  );
}
/**
 * 系统组织修改
 */
export async function updateSysDepartment(
  id: number,
  data: SysDepartmentApi.SysDepartmentRecord,
) {
  return requestClient.put<SysDepartmentApi.SysDepartmentRecord>(
    `/system/department/${id}`,
    data,
  );
}
/**
 * 系统组织删除
 */
export async function deleteSysDepartment(ids: number[]) {
  return requestClient.delete<number>('/system/department', {
    params: { ids },
  });
}
