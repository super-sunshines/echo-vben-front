import { requestClient } from '#/api/request';

export namespace CbTencentCloudApi {
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

  /**
   * sts.Credentials
   */
  export interface StsCredentials {
    TmpSecretId: string;
    TmpSecretKey: string;
    Token: string;
  }

  /**
   * sts.CredentialError
   */
  export interface StsCredentialError {
    Code?: string;
    Message?: string;
    RequestId?: string;
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
