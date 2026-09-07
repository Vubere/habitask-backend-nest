

export type HabitOccurenceType = {
  id: string;
  date: string;
  habit_id: string;
  user_id: string;
}

export type HabitOccurenceCreateType = {
  date: string;
  habit_id: string;
  user_id: string;
}

export type HabitOccurenceUpdateType = {
  date?: string;
  habit_id?: string;
  user_id?: string;
}

export type HabitOccurenceCompleteType = {
  is_positive: boolean;
}

export type HabitOccurenceSummaryType = {
  label: string;
  count: number;
  positive_count: number;
  negative_count: number;
  last_habbit_date: string;
}

export type HabitOccurenceQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
} & HabitOccurenceType;