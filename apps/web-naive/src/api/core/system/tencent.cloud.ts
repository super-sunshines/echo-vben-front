import type { AuthApi } from './auth';

import { requestClient } from '#/api/request';

export namespace CbTencentCloudApi {
  /**
   * sts.CredentialError
   */
  export interface StsCredentialError {
    Code?: string;
    Message?: string;
    RequestId?: string;
  }
  /**
   * sts.Credentials
   */
  export interface StsCredentials {
    TmpSecretId: string;
    TmpSecretKey: string;
    Token: string;
  }
  /**
   * services.TencentCloudCosTmpKey
   */
  export interface TencentCloudCosTmpKey {
    /**
     * Bucket 表示COS存储桶的名称，用于定位资源。
     */
    Bucket: string;
    /**
     * CdnUrl 表示内容分发网络（CDN）的URL，用于加速内容的分发和访问。
     */
    CanvasRenderer: string;
    Credentials: StsCredentials;
    Error: StsCredentialError;
    Expiration: string;
    ExpiredTime: number;
    /**
     * Region 表示存储桶所在的地理区域，用于路由请求到正确的数据中心。
     */
    Region: string;
    RequestId: string;
    StartTime: number;
    CdnUrl: string;
  }

  export interface WorkWechatConfigSignature {
    timestamp: number;
    nonceStr: string;
    signature: string;
  }
}

/**
 * 获取腾讯云临时密钥
 */
export async function getTencentCloudCosTemKey() {
  return requestClient.get<CbTencentCloudApi.TencentCloudCosTmpKey>(
    '/tencent/cloud/cos/tem-key',
  );
}

/**
 * 获取企业微信配置签名
 * @param url 授权地址
 * @returns 签名配置
 */
export async function getWorkWechatConfigSignature(url: string) {
  return requestClient.get<CbTencentCloudApi.WorkWechatConfigSignature>(
    `/work-wechat/signature?url=${url}`,
  );
}

/**
 * 使用临时code登录
 * @param code 企业微信登录临时code
 * @returns  登录结果
 */

export async function loginByWorkWechat(code: string) {
  return requestClient.get<AuthApi.LoginResult>('/work-wechat/login', {
    params: {
      code,
    },
  });
}
