import type { Ref } from 'vue';

import { ref } from 'vue';

import COS from 'cos-js-sdk-v5';
import dayjs from 'dayjs';
import { v4 as UUID } from 'uuid';

import { getTencentCloudCosTemKey } from '#/api';

interface Task {
  fileName: string;
  taskId: string;
}
const Bucket = import.meta.env.VITE_APP_TENCENT_COS_BUCKET as string;
const Region = import.meta.env.VITE_APP_TENCENT_COS_REGION as string;
if (!Bucket || !Bucket) {
  throw new Error('请配置腾讯云COS');
} else {
  window.console.table({ Bucket, Region });
}
export function useUpload() {
  const taskList: Ref<Task[]> = ref([]);
  const cosSdk = new COS({
    async getAuthorization(_, callback) {
      const data = await getTencentCloudCosTemKey();
      callback({
        TmpSecretId: data.Credentials.TmpSecretId,
        TmpSecretKey: data.Credentials.TmpSecretKey,
        SecurityToken: data.Credentials.Token,
        StartTime: data.StartTime,
        ExpiredTime: data.ExpiredTime,
      });
    },
  });

  const upLoadFile = async (
    dir: string,
    file: File,
    ProgressCallBack: (progress: number) => void = () => {},
  ) => {
    const Key = await uuidFilePath(dir, file.name);
    const res: any = await cosSdk.sliceUploadFile({
      Bucket,
      Region,
      Key,
      Body: file,
      onTaskReady(taskId: string) {
        taskList.value.push({ taskId, fileName: file.name });
      },
      onProgress(progressData: any) {
        ProgressCallBack(progressData.percent * 100);
      },
    });

    const taskIndex = taskList.value.findIndex(
      (element) => file.name === element.fileName,
    );
    if (taskIndex !== -1) {
      taskList.value.splice(taskIndex, 1);
    }
    return `https://${res.Location}`;
  };

  const upLoadContent = async (
    file: any,
    Key: any,
    ProgressCallBack: (progress: number) => void,
  ) => {
    const res: any = await cosSdk.sliceUploadFile({
      Bucket,
      Region,
      Key,
      Body: file,
      onProgress(progressData: any) {
        ProgressCallBack(progressData.percent * 100);
      },
    });
    return `https://${res.Location}`;
  };

  const upLoadCancel = async (file: File) => {
    const taskIndex = taskList.value.findIndex(
      (element) => file.name === element.fileName,
    );
    if (taskIndex !== -1) {
      const { taskId } = taskList.value[taskIndex] as Task;
      await cosSdk.cancelTask(taskId);
      taskList.value.splice(taskIndex, 1);
    }
  };

  const uuidFilePath = async (dir: string, filename: string) => {
    const extname = await getFileExtname(filename);
    return extname === ''
      ? `${dir}/${dayjs().year()}/${dayjs().month()}/${UUID()}`
      : `${dir}/${dayjs().year()}/${dayjs().month()}/${UUID()}.${extname}`;
  };

  const getFileExtname = async (filename: string) => {
    if (filename.split('.').length > 1) {
      const ext_index = filename.lastIndexOf('.');
      return filename.slice(ext_index + 1);
    } else {
      return '';
    }
  };

  return {
    upLoadFile,
    upLoadContent,
    upLoadCancel,
    uuidFilePath,
    getFileExtname,
    taskList,
  };
}
