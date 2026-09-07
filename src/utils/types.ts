export type PaginationAndSort = {
  page: number;
  per_page: number;
  sort_by: string;
  sort_direction: "ASC" | "DESC";
}

export type SummaryGroup = {
  GroupBy: string;
  DateGroup: string;
  Field: string;
  AllowedGrouping: Record<string, string>;
}