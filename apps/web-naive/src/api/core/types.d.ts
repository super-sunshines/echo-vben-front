declare interface ApiPageParam {
  page: number;
  pageSize: number;
}
declare interface ApiPageResult<T> extends ApiPageParam {
  items: T[];
  total: number;
}
