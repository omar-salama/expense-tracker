export class PaginatedData<T> {
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
} 