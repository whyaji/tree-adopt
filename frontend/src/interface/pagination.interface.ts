export interface PaginationParams {
  search?: string;
  page: number;
  limit: number;
  filter?: string;
  withData?: string;
  sortBy?: string;
  order?: string;
  select?: string;
}

export interface PaginationParamsOptional {
  search?: string;
  page?: number;
  limit?: number;
  filter?: string;
  withData?: string;
  sortBy?: string;
  order?: string;
  select?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}
