
export type HabitTaskType = {
  id: number;
  name: string;
  description: string;
  category: string;
  status: string;
  progress: number;
  streak?: number;
  created_at: string;
  updated_at: string;
};

export type HabitTaskQuery = {
  search: string;
  created_at_lte?: string;
  created_at_gte?: string;
  user_id: string;
};
