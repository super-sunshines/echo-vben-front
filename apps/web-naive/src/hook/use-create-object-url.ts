import { useObjectUrl } from '@vueuse/core';
/**
 * 创建文件的 URL 对象，并提供相关操作
 *
 * 该函数用于生成文件的 URL 对象，并提供了一组方法来操作这些 URL 对象，包括生成、移除和清空
 */
export function useCreateObjectUrl() {
  // 文件 URL 列表
  const fileList = new Array<string>();

  /**
   * 为单个文件生成 URL 对象
   *
   * @param file 要生成 URL 对象的文件
   * @returns 生成的 URL 对象
   */
  function genUrl(file: File) {
    // 使用给定的文件生成 URL 对象
    const uuid = useObjectUrl(file);
    // 将生成的 URL 对象添加到文件 URL 列表中
    fileList.push(uuid.value as string);
    return uuid.value as string;
  }

  /**
   * 移除指定的 URL 对象
   *
   * @param uuid 要移除的 URL 对象的唯一标识符
   */
  function removeUrl(uuid: string) {
    // 遍历文件 URL 列表
    fileList.forEach((item) => {
      // 如果当前项与要移除的 URL 对象匹配
      if (item === uuid) {
        // 撤销该 URL 对象的引用
        URL.revokeObjectURL(item);
        // 从文件 URL 列表中移除该项
        fileList.splice(fileList.indexOf(item), 1);
      }
    });
  }

  /**
   * 清空所有 URL 对象
   */
  function clearAll() {
    // 遍历文件 URL 列表
    fileList.forEach((item) => {
      // 撤销所有 URL 对象的引用
      URL.revokeObjectURL(item);
    });
  }

  /**
   * 为文件数组中的每个文件生成 URL 对象
   *
   * @param files 要生成 URL 对象的文件数组
   * @returns 生成的 URL 对象数组
   */
  function addAll(files: File[]) {
    // 用于存储生成的 URL 对象的数组
    const uuids = [];
    // 遍历文件数组
    for (const file of files) {
      // 为每个文件生成 URL 对象
      const uuid = useObjectUrl(file);
      // 将生成的 URL 对象添加到数组中
      uuids.push(uuid.value as string);
    }
    return uuids;
  }
  // 返回包含生成、移除和清空 URL 对象的方法的对象
  return { genUrl, removeUrl, clearAll, addAll };
}
