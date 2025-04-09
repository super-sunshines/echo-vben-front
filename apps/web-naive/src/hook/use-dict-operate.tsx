// import { message } from '#/adapter/naive';
// import {
//   detailSysDictByCode,
//   pageListSysDictChild,
//   type SysDictApi,
// } from '#/api/core/system/dict';
// import {
//   SysDictStyleType,
//   SysDictValueTypeEnum,
// } from '#/views/_system/dict/const';
// import { useVbenDrawer } from '@vben/common-ui';
// import { IconifyIcon } from '@vben/icons';
// import {
//   NButton,
//   NDataTable,
//   NInput,
//   NInputNumber,
//   NSelect,
//   NSpace,
//   type DataTableColumns,
//   type PaginationProps,
// } from 'naive-ui';
// import { computed, ref } from 'vue';

// interface RowData extends SysDictApi.SysDictChildRecord {}

// export function useDictOperate(dictCode: string) {
//   const [Draw, drawApi] = useVbenDrawer({});
//   const dictDataChildren = ref<RowData[]>([]);
//   const dictData = ref<SysDictApi.SysDictRecord>();

//   detailSysDictByCode(dictCode).then((res) => (dictData.value = res));

//   const pagination = ref<PaginationProps>({
//     page: 1,
//     pageSize: 10,
//     pageSizes: [10, 20, 30, 40],
//     showSizePicker: true,
//     showQuickJumper: true,
//     onChange(page) {
//       pagination.value.page = page;
//       fetchModelInfo();
//     },
//     onUpdatePageSize(pageSize) {
//       pagination.value.pageSize = pageSize;
//       fetchModelInfo();
//     },
//   });

//   // 使用 computed 处理依赖于响应式数据的列定义
//   const createColumns = computed<DataTableColumns<RowData>>(() => [
//     {
//       title: '标签',
//       key: 'label',
//       width: 250,
//       render(row, index) {
//         return (
//           <NInput
//             size={'small'}
//             onUpdateValue={(value) =>
//               dictDataChildren.value[index] &&
//               (dictDataChildren.value[index].label = value)
//             }
//             value={row.label}
//           ></NInput>
//         );
//       },
//     },
//     {
//       title: '标签样式',
//       key: 'type',
//       width: 150,
//       render(row, index) {
//         return (
//           <NSelect
//             size={'small'}
//             onUpdateValue={(value) =>
//               dictDataChildren.value[index] &&
//               (dictDataChildren.value[index].style = value)
//             }
//             value={row.style}
//             options={SysDictStyleType}
//           ></NSelect>
//         );
//       },
//     },
//     {
//       title: '字典值',
//       key: 'dictCode',
//       width: 250,
//       render(row, index) {
//         return dictData.value?.valueType === SysDictValueTypeEnum.Number ? (
//           <NInputNumber
//             size={'small'}
//             onUpdateValue={(value) =>
//               dictDataChildren.value[index] &&
//               (dictDataChildren.value[index].value = `${value}`)
//             }
//             value={Number(row.value)}
//           ></NInputNumber>
//         ) : (
//           <NInput
//             size={'small'}
//             onUpdateValue={(value) =>
//               dictDataChildren.value[index] &&
//               (dictDataChildren.value[index].value = value)
//             }
//             value={`${row.value}`}
//           ></NInput>
//         );
//       },
//     },
//     {
//       title: '排序',
//       width: 200,
//       key: 'orderNum',
//       render(row, index) {
//         return (
//           <NInputNumber
//             size={'small'}
//             onUpdateValue={(value) => {
//               if (dictDataChildren.value[index]) {
//                 dictDataChildren.value[index].orderNum = Number(value);
//                 dictDataChildren.value.sort((a, b) => a.orderNum - b.orderNum);
//               }
//             }}
//             value={row.orderNum}
//           ></NInputNumber>
//         );
//       },
//     },
//     {
//       title: '描述',
//       key: 'describe',
//       minWidth: 400,
//       render(row, index) {
//         return (
//           <NInput
//             size={'small'}
//             onUpdateValue={(value) =>
//               dictDataChildren.value[index] &&
//               (dictDataChildren.value[index].describe = value)
//             }
//             value={row.describe}
//           ></NInput>
//         );
//       },
//     },
//     {
//       title: '操作',
//       width: 150,
//       fixed: 'right',
//       align: 'center',
//       key: 'orderNum',
//       render(row, index) {
//         return (
//           <NSpace align={'center'} class={'w-full'} justify="center">
//             {/* 插入 */}
//             <NButton
//               circle
//               onClick={() => {
//                 // 在这里插入新元素
//                 dictDataChildren.value.splice(index + 1, 0, {
//                   dictCode: '',
//                   id: 0,
//                   itemClass: '',
//                   label: '',
//                   orderNum: row.orderNum + 1,
//                   style: 'default',
//                   type: Number(dictData.value?.valueType),
//                   value: '',
//                   describe: '',
//                 }); // 在索引后插入新元素
//               }}
//               tertiary={true}
//               type={'success'}
//             >
//               {{
//                 icon: () => (
//                   <IconifyIcon
//                     class={'-rotate-180'}
//                     icon={'carbon:rotate-clockwise'}
//                   ></IconifyIcon>
//                 ),
//               }}
//             </NButton>
//             {/* 删除 */}
//             <NButton
//               circle
//               onClick={() => {
//                 dictDataChildren.value.splice(index, 1);
//               }}
//               tertiary={true}
//               type={'error'}
//             >
//               {{
//                 icon: () => (
//                   <IconifyIcon icon={'carbon:trash-can'}></IconifyIcon>
//                 ),
//               }}
//             </NButton>
//           </NSpace>
//         );
//       },
//     },
//   ]);

//   const fetchModelInfo = async () => {
//     message.loading('加载中...');
//     pageListSysDictChild({
//       page: pagination.value.page as number,
//       pageSize: pagination.value.pageSize as number,
//       dictCode: dictCode,
//     }).then(({ items }) => {
//       dictDataChildren.value = items;
//       message.destroyAll();
//       message.success('加载成功');
//     });
//   };

//   const DictOperateDraw = () => (
//     <Draw>
//       <NDataTable
//         class="h-full"
//         columns={createColumns.value}
//         data={dictDataChildren.value}
//         pagination={pagination.value}
//       />
//     </Draw>
//   );

//   const edit = async () => {
//     drawApi.open();
//   };

//   return {
//     DictOperateDraw,
//     edit,
//   };
// }
