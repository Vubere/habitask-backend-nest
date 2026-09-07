
export type HabitActionType = {
  id: string;
  title: string;
  description: string;
  category: string;
  cost_incurred: number;
  is_positive: boolean;
  habit_id: string;
  user_id: string;
}

export type HabitActionCreateType = {
  title: string;
  description: string;
  category: string;
  cost_incurred: number;
  is_positive: boolean;
  habit_id: string;
  user_id: string;
}

export type HabitActionUpdateType = {
  title?: string;
  description?: string;
  category?: string;
  cost_incurred?: number;
  is_positive?: boolean;
  habit_id?: string;
  user_id?: string;
}

export type HabitActionCompleteType = {
  is_positive: boolean;
}

export type HabitActionQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
} & HabitActionType;