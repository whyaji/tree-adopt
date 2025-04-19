export interface PaginationParams {
  search?: string;
  page: number;
  limit: number;
  filter?: string;
  withData?: string;
  sortBy?: string;
  order?: string;
}
