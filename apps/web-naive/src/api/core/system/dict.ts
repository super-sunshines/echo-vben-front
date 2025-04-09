import { requestClient } from '#/api/request';

export namespace SysDictApi {
  export interface SysDictChildPageParam extends ApiPageParam {
    [key: string]: any;
  }

  export interface SysDictChildRecord {
    /**
     * 字典代码
     */
    dictCode: string;
    /**
     * 主键
     */
    id: number;
    /**
     * 样式class
     */
    itemClass: string;
    /**
     * 名称
     */
    label: string;
    /**
     * 排序
     */
    orderNum: number;
    /**
     * 显示的type
     */
    style: 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';
    /**
     * 值类型 1 数字 2 字符串
     */
    type: number;
    /**
     * 值
     */
    value: number | string;
    /**
     * 描述
     */
    describe: string;
  }
  export interface SysDictPageParam extends ApiPageParam {
    [key: string]: any;
  }

  export interface SysDictRecord {
    /**
     * 值类型
     */
    valueType: number;

    /**
     * 字典代码
     */
    code: string;
    /**
     * 字典描述
     */
    describe: string;
    /**
     * 主键
     */
    id: number;
    /**
     * 所属模块
     */
    module: number;
    /**
     * 字典名称
     */
    name: string;
    /**
     * 字典状态
     */
    status: number;

    children: SysDictChildRecord[];
  }
}

/**
 * 字典列表
 */
export async function pageListSysDict(params: SysDictApi.SysDictPageParam) {
  return requestClient.get<ApiPageResult<SysDictApi.SysDictRecord>>(
    '/system/dict/list',
    {
      params,
    },
  );
}

/**
 * 字典详情
 */
export async function detailSysDict(id: number) {
  return requestClient.get<SysDictApi.SysDictRecord>(`/system/dict/${id}`);
}

/**
 * 字典详情ByCode
 */
export async function detailSysDictByCode(code: string) {
  return requestClient.get<SysDictApi.SysDictRecord>(
    `/system/dict/code/${code}`,
  );
}

/**
 * 字典新增
 */
export async function addSysDict(data: SysDictApi.SysDictRecord) {
  return requestClient.post<SysDictApi.SysDictRecord>(`/system/dict`, data);
}
/**
 * 字典修改
 */
export async function updateSysDict(
  id: number,
  data: SysDictApi.SysDictRecord,
) {
  return requestClient.put<SysDictApi.SysDictRecord>(
    `/system/dict/${id}`,
    data,
  );
}
/**
 * 字典删除
 */
export async function deleteSysDict(ids: number[]) {
  return requestClient.delete<number>('/system/dict', { params: { ids } });
}

/**
 * 字典内容列表
 */
export async function pageListSysDictChild(
  params: SysDictApi.SysDictChildPageParam,
) {
  return requestClient.get<ApiPageResult<SysDictApi.SysDictChildRecord>>(
    '/system/dict/child/list',
    {
      params,
    },
  );
}

/**
 * 字典内容修改
 */
export async function updateSysDictChild(
  code: string,
  data: SysDictApi.SysDictChildRecord[],
) {
  return requestClient.put<boolean>(`/system/dict/child/${code}`, data);
}
/**
 * 所有字典代码
 */
export async function listDictCodeList() {
  return requestClient.get<Array<{ code: string; name: string }>>(
    `/system/dict/code-list`,
  );
}
