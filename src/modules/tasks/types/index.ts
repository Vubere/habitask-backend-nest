export type TaskStatus = 'todo' | 'done';

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type TaskType = {
  id: string;
  title: string;
  notes: string;
  icon: string;
  color: string;
  archived_at: Date | null;
  user_id: string;
  status: TaskStatus;
  due_date: string | null;
  due_time: string | null;
  priority: string;
  subtasks: Subtask[];
  completed_at: Date | null;
};

export type TaskCreateType = {
  title: string;
  notes?: string;
  icon?: string;
  color?: string;
  user_id: string;
  status?: TaskStatus;
  due_date?: string | null;
  due_time?: string | null;
  priority?: string;
  subtasks?: Subtask[];
};

export type TaskUpdateType = Partial<Omit<TaskType, 'id' | 'user_id'>> & {
  archived?: boolean;
};

export type TaskQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
  archived?: boolean;
} & Partial<TaskType>;

export type TaskSummaryType = {
  label: string;
  count: number;
  completed_count: number;
  incomplete_count: number;
  due_count: number;
  last_task_date: string;
};
