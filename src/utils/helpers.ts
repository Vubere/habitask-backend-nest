import { SummaryGroup } from "./types";

export function getOffset(page: number, perPage: number): number {
  return (page - 1) * perPage;
}


export function getSummaryExpression(summaryGroup: SummaryGroup): string {
  let group = summaryGroup.AllowedGrouping[summaryGroup.GroupBy];
  if (!group) {
    throw new Error(`invalid group by: ${summaryGroup.GroupBy}`);
  }
  if (summaryGroup.DateGroup !== "") {
    return getSummaryDateExpression(summaryGroup.DateGroup, summaryGroup.GroupBy);
  }
  return group;
}

export function getSummaryDateExpression(dateGroup: string, field: string): string {
  if (field === "") {
    throw new Error("date group field cannot be empty");
  }
  switch (dateGroup) {
    case "day":
      return `DATE_FORMAT(${field}, '%Y-%m-%d')`;
    case "week":
      return `DATE_FORMAT(${field}, '%x-W%v')`;
    case "week_day":
      return `DATE_SUB(DATE(${field}), INTERVAL DAYOFWEEK(${field}) DAY)`;
    case "month":
      return `DATE_FORMAT(${field}, '%Y-%m')`;
    case "month_name":
      return `DATE_FORMAT(${field}, '%Y-%M')`;
    case "year":
      return `DATE_FORMAT(${field}, '%Y')`;
    default:
      throw new Error(`invalid date group: ${dateGroup}`);
  }
}