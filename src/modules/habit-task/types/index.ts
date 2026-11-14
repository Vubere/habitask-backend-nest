export type HabitTaskType = {
  id: string;
  type: 'habit' | 'task';
  title: string;
  notes: string;
  icon: string;
  color: string;
  status: string;
  progress: number;
  target: number;
  streak: number | null;
  created_at: string;
  updated_at: string;
};

export type HabitTaskQuery = {
  search?: string;
  created_at_lte?: string;
  created_at_gte?: string;
  user_id: string;
  type?: string;
};
