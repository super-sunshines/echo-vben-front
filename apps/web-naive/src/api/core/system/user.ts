import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SysUserApi {
  export interface SysUserPageParam extends ApiPageParam {}

  export interface SysUserRecord {
    /**
     * 头像
     */
    avatar?: string;
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
     * 邮箱地址
     */
    email?: string;
    /**
     * 主键
     */
    id?: number;
    /**
     * 上次在线时间
     */
    lastOnline?: number;
    /**
     * 昵称
     */
    nickName?: string;
    /**
     * 手机号
     */
    phone?: string;
    /**
     * 真实姓名
     */
    realName?: string;
    /**
     * 角色CODE列表
     */
    roleCodeList?: string[];
    /**
     * 状态
     */
    status?: number;
    /**
     * 更新者
     */
    updateBy?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    /**
     * 用户名
     */
    username?: string;
  }
}

/**
 * 系统用户列表
 */
export async function pageListSysUser(params: SysUserApi.SysUserPageParam) {
  return requestClient.get<ApiPageResult<SysUserApi.SysUserRecord>>(
    '/system/user/list',
    {
      params,
    },
  );
}

/**
 * 系统用户详情
 */
export async function detailSysUser(id: number) {
  return requestClient.get<SysUserApi.SysUserRecord>(`/system/user/${id}`);
}

/**
 * 系统用户新增
 */
export async function addSysUser(data: SysUserApi.SysUserRecord) {
  return requestClient.post<SysUserApi.SysUserRecord>(`/system/user`, data);
}
/**
 * 系统用户修改
 */
export async function updateSysUser(
  id: number,
  data: SysUserApi.SysUserRecord,
) {
  return requestClient.put<SysUserApi.SysUserRecord>(
    `/system/user/${id}`,
    data,
  );
}
/**
 * 系统用户删除
 */
export async function deleteSysUser(ids: number[]) {
  return requestClient.delete<number>('/system/user', { params: { ids } });
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
