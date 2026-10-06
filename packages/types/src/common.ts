export type EntityId = string;
export type ISODateTime = string;

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
