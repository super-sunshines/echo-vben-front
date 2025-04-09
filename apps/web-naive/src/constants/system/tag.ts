import type { TagProps } from 'naive-ui';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';

export type TagPropsType = Record<
  number | string,
  Partial<TagProps & { value: number | string }> & { text: string }
>;
export function tagPropToOptions(records: TagPropsType): SelectMixedOption[] {
  return Object.keys(records).map((i) => {
    const content = records[Number(i)];
    return {
      label: content?.text as string,
      value: Number(i),
    } as unknown as SelectMixedOption;
  });
}
