
export type TaskStepType = {
  id: string;
  description: string;
  is_done: boolean;
  done_at: string;
  time_due: string;
  estimated_duration: number;
  actual_duration: number;
  priority: string;
  user_id: string;
  order: number;
  task_id: string;
}

export type TaskStepCreateType = {
  description: string;
  estimated_duration: number;
  time_due: string;
  task_id: string;
  user_id: string;
}

export type TaskStepUpdateType = {
  description?: string;
  estimated_duration?: number;
  time_due?: string;
  actual_duration?: number;
}

export type TaskStepCompleteType = {
  done_at: string;
}

export type TaskStepSummaryType = {
  label: string;
  count: number;
  done_count: number;
  last_task_step_date: string;
  time_due: string;
  estimated_time: number;
  actual_time: number;
  time_unit: string;
}

export type TaskStepQueryType = {
  search?: string;
  done_at_lte?: string;
  done_at_gte?: string;
  time_due_lte?: string;
  time_due_gte?: string;
  estimated_duration_lte?: number;
  estimated_duration_gte?: number;
  actual_duration_lte?: number;
  actual_duration_gte?: number;
  group_by?: string;
  date_group?: string;
} & TaskStepType;