import { z } from '@vben/common-ui';

export const PhoneNumberZodSchema = z.string().refine(
  (value: string) => {
    // 如果值为空，直接通过验证
    if (!value) return true;
    // 正则表达式检查手机号格式
    return /^1[3-9]\d{9}$/.test(value); // 手机号为11位数字
  },
  {
    message: '请输入正确的手机号', // 错误提示信息
  },
);

// 体重验证 schema
export const NumberZodSchemaBuild = (
  min: number,
  max: number,
  label: string,
) => {
  return z
    .number({
      required_error: `${label}不能为空`, // 自定义空消息
      invalid_type_error: `${label}必须是一个数字`, // 自定义类型错误消息
    })
    .min(min, { message: `${label}必须大于${min}` })
    .max(max, { message: `${label}必须小于${max}` });
};
