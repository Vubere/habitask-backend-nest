export class TaskDto {
  id: string;
  name: string;
  description: string;
  category: string;
  user_id: string;
  due_at: Date;
  completed_at: Date;
  estimated_duration: number;
  actual_duration: number;
}

export class TaskSummaryDto {
  label: string;
  count: number;
  completed_count: number;
  incomplete_count: number;
  dueCount: number;
  lastDone: string | null;
}
