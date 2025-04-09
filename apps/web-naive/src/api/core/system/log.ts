import { requestClient } from '#/api/request';

export namespace SysLogApi {
  /**
   * 日志分页列表
   */
  export interface OperateLogPageParam extends ApiPageParam {}
  export interface LoginLogPageParam extends ApiPageParam {}

  /**
   * 日志记录
   */
  export interface OperateLogRecord {
    /**
     * 业务类型
     */
    businessType?: number;
    /**
     * 执行的方法
     */
    callFunc?: string;
    /**
     * 消耗时间
     */
    costTime?: number;
    /**
     * 错误信息
     */
    errorMsg?: string;
    /**
     * 主键
     */
    id?: number;
    /**
     * 返回响应
     */
    jsonResult?: string;
    /**
     * 部门名称
     */
    operateDepart?: string;
    /**
     * 请求IP
     */
    operateIp?: string;
    /**
     * 请求地点
     */
    operateLocation?: string;
    /**
     * 操作人员
     */
    operateName?: string;
    /**
     * 请求参数
     */
    operateParam?: string;
    /**
     * 操作时间
     */
    operateTime?: string;
    /**
     * 操作类型
     */
    operateType?: number;
    /**
     * 请求地址
     */
    operateUrl?: string;
    /**
     * 操作者ID
     */
    operateUserId?: number;
    /**
     * 请求体
     */
    requestJsonBody?: string;
    /**
     * 请求方法
     */
    requestMethod?: string;
    /**
     * 操作状态
     */
    status?: number;
    /**
     * 标题
     */
    title?: string;
  }
  /**
   * model.SysLoginInfo
   */
  export interface LoginLogInfo {
    /**
     * 浏览器类型
     */
    browser?: string;
    /**
     * 主键
     */
    id?: number;
    /**
     * 登录方式
     */
    loginType?: number;
    /**
     * 错误信息
     */
    msg?: string;
    /**
     * 请求IP
     */
    operateIp?: string;
    /**
     * 请求地点
     */
    operateLocation?: string;
    /**
     * 操作人员
     */
    operateName?: string;
    /**
     * 操作时间
     */
    operateTime?: string;
    /**
     * 操作系统
     */
    os?: string;
    /**
     * 请求方法
     */
    requestMethod?: string;
    /**
     * 登录状态
     */
    status?: number;
    /**
     * 信息
     */
    userAgent?: string;
  }
}
/**
 * 系统操作日志分页列表
 */
export async function pageListSysOperateLog(
  params: SysLogApi.OperateLogPageParam,
) {
  return requestClient.get<ApiPageResult<SysLogApi.OperateLogRecord>>(
    `/system/log/list`,
    {
      params,
    },
  );
}
/**
 * 登录日志分页列表
 */
export async function pageListSysLoginLog(params: SysLogApi.LoginLogPageParam) {
  return requestClient.get<ApiPageResult<SysLogApi.LoginLogInfo>>(
    `/system/log/login/list`,
    {
      params,
    },
  );
}
