

export type HabitType = {
  id: string;
  name: string;
  description: string;
  category: string;
  pros: string;
  cons: string;
  user_id: string;
  is_positive: boolean;
  last_done: string;
}

export type HabitCreateType = {
  name: string;
  description: string;
  category: string;
  pros: string;
  cons: string;
  user_id: string;
}

export type HabitUpdateType = {
  name?: string;
  description?: string;
  category?: string;
  pros?: string;
  cons?: string;
}

export type HabitCompleteType = {
  is_positive: boolean;
}

export type HabitQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
} & HabitType;