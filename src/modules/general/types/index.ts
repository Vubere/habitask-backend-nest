
export type PaginationAndSort = {
  page: number;
  per_page: number;
  sort_by: string;
  sort_direction: "ASC" | "DESC";
}