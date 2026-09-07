
export type TaskType = {
  id: string;
  name: string;
  category: string;
  description: string;
  is_completed: boolean;
  completed_at: string;
  due_at: string;
  estimated_duration: number;
  actual_duration: number;
  duration_unit: string;
  user_id: string;
  priority: string;
}

export type TaskCreateType = {
  name: string;
  category: string;
  description: string;
  estimated_duration: number;
  duration_unit: string;
  user_id: string;
}

export type TaskUpdateType = {
  name?: string;
  category?: string;
  description?: string;
  estimated_duration?: number;
  actual_duration?: number;
}

export type TaskCompleteType = {
  completed_at: string;
}

export type TaskSummaryType = {
  label: string;
  count: number;
  completed_count: number;
  incomplete_count: number;
  due_count: number;
  last_task_date: string;
}

export type TaskQueryType = {
  search?: string;
  completed_at_lte?: string;
  completed_at_gte?: string;
  due_at_lte?: string;
  due_at_gte?: string;
  estimated_duration_lte?: number;
  estimated_duration_gte?: number;
  actual_duration_lte?: number;
  actual_duration_gte?: number;
  group_by?: string;
  date_group?: string;
  priority?: string;
} & TaskType;