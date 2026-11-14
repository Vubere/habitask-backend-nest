
export type HabitCompletionType = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  count: number;
  completed_at: Date;
};

export type HabitCompletionCreateType = {
  habit_id: string;
  user_id: string;
  date?: string;
  count?: number;
  completed_at?: Date;
};

export type HabitCompletionUpdateType = {
  date?: string;
  count?: number;
};

export type HabitCompletionQueryType = {
  search?: string;
  habit_id?: string;
  user_id?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
};

export type HabitStatsType = {
  current_streak: number;
  best_streak: number;
  completion_rate: number;
};
