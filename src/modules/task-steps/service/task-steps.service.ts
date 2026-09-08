import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TaskStep } from "../../../typeorm/entities/TaskStep";
import { Repository } from "typeorm";
import { TaskStepQueryType, TaskStepSummaryType, TaskStepType } from "../types";
import { getSummaryExpression } from "../../../utils/helpers";

@Injectable()
export class TaskStepsService {
  constructor(@InjectRepository(TaskStep) private taskStepRepository: Repository<TaskStep>) {}
  findTaskStep(id: string) {
    return this.taskStepRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findTaskSteps(filter: Partial<TaskStepQueryType>, pagination: any) {
    let query = this.taskStepRepository.createQueryBuilder('task_steps');
    if (filter.search) {
      query = query.where(
        'task_steps.description LIKE :search OR task_steps.time_due LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.done_at_lte) {
      query = query.andWhere('task_steps.done_at <= :done_at_lte', {
        done_at_lte: filter.done_at_lte,
      });
    }
    if (filter.done_at_gte) {
      query = query.andWhere('task_steps.done_at >= :done_at_gte', {
        done_at_gte: filter.done_at_gte,
      });
    }
    if (filter.time_due_lte) {
      query = query.andWhere('task_steps.time_due <= :time_due_lte', {
        time_due_lte: filter.time_due_lte,
      });
    }
    if (filter.time_due_gte) {
      query = query.andWhere('task_steps.time_due >= :time_due_gte', {
        time_due_gte: filter.time_due_gte,
      });
    }
    if (filter.estimated_duration_lte) {
      query = query.andWhere(
        'task_steps.estimated_duration <= :estimated_duration_lte',
        {
          estimated_duration_lte: filter.estimated_duration_lte,
        },
      );
    }
    if (filter.estimated_duration_gte) {
      query = query.andWhere(
        'task_steps.estimated_duration >= :estimated_duration_gte',
        {
          estimated_duration_gte: filter.estimated_duration_gte,
        },
      );
    }
    if (filter.actual_duration_lte) {
      query = query.andWhere('task_steps.actual_duration <= :actual_duration_lte', {
        actual_duration_lte: filter.actual_duration_lte,
      });
    }
    if (filter.actual_duration_gte) {
      query = query.andWhere('task_steps.actual_duration >= :actual_duration_gte', {
        actual_duration_gte: filter.actual_duration_gte,
      });
    }
    const taskStepQuery: Partial<TaskStepType> = getTaskStepQueryMainFields(filter);
    if (Object.keys(taskStepQuery).length > 0) {
      query = query.andWhere(taskStepQuery);
    }
    return query
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .orderBy(pagination.sort_by, pagination.sort_direction)
      .getMany();
  }
  getTaskStepSummary(filter: Partial<TaskStepQueryType>, pagination: any): Promise<TaskStepSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: taskStepSummaryGroups,
    });
    let query = this.taskStepRepository.createQueryBuilder('task_steps');
    if (filter.search) {
      query = query.where(
        'task_steps.description LIKE :search OR task_steps.time_due LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.done_at_lte) {
      query = query.andWhere('task_steps.done_at <= :done_at_lte', {
        done_at_lte: filter.done_at_lte,
      });
    }
    if (filter.done_at_gte) {
      query = query.andWhere('task_steps.done_at >= :done_at_gte', {
        done_at_gte: filter.done_at_gte,
      });
    }
    if (filter.time_due_lte) {
      query = query.andWhere('task_steps.time_due <= :time_due_lte', {
        time_due_lte: filter.time_due_lte,
      });
    }
    if (filter.time_due_gte) {
      query = query.andWhere('task_steps.time_due >= :time_due_gte', {
        time_due_gte: filter.time_due_gte,
      });
    }
    if (filter.estimated_duration_lte) {
      query = query.andWhere(
        'task_steps.estimated_duration <= :estimated_duration_lte',
        {
          estimated_duration_lte: filter.estimated_duration_lte,
        },
      );
    }
    if (filter.estimated_duration_gte) {
      query = query.andWhere(
        'task_steps.estimated_duration >= :estimated_duration_gte',
        {
          estimated_duration_gte: filter.estimated_duration_gte,
        },
      );
    }
    if (filter.actual_duration_lte) {
      query = query.andWhere('task_steps.actual_duration <= :actual_duration_lte', {
        actual_duration_lte: filter.actual_duration_lte,
      });
    }
    if (filter.actual_duration_gte) {
      query = query.andWhere('task_steps.actual_duration >= :actual_duration_gte', {
        actual_duration_gte: filter.actual_duration_gte,
      });
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'task_steps.user_id = users.id');
    }
    if (filter.group_by?.startsWith('tasks.')) {
      query = query.innerJoin('tasks', 'tasks', 'task_steps.task_id = tasks.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(task_steps.id) as count,
        SUM(task_steps.is_done = 0) as done_count,
        MAX(task_steps.done_at) as last_task_step_date,
        MAX(task_steps.time_due) as time_due,
        SUM(task_steps.estimated_duration) as estimated_time,
        SUM(task_steps.actual_duration) as actual_time,
        task_steps.time_unit as time_unit
      `,
      )
      .groupBy(groupExpr)
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .getRawMany();
  }
  createTaskStep(taskStep: TaskStep) {
    const createdTaskStep = this.taskStepRepository.create(taskStep);
    return this.taskStepRepository.save(createdTaskStep);
  }
  async updateTaskStep(id: string, taskStep: TaskStep) {
    await this.taskStepRepository.update(id, taskStep);
    return this.taskStepRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteTaskStep(id: string) {
    return this.taskStepRepository.delete(id);
  }
}

const taskStepSummaryGroups: Record<string, string> = {
  created_at: 'task_steps.created_at',
  task_id: 'task_steps.task_id',
  description: 'task_steps.description',
  time_due: 'task_steps.time_due',
  priority: 'task_steps.priority',
  is_done: 'task_steps.is_done',
  done_at: 'task_steps.done_at',
  user_id: 'task_steps.user_id',
  username: 'users.username',
  task_name: 'tasks.name',
  tast_category: 'tasks.category',
};

function getTaskStepQueryMainFields(filter: Partial<TaskStepQueryType>): Partial<TaskStepType> {
  let taskStepQuery: Partial<TaskStepType> = {};
  if (filter.task_id) {
    taskStepQuery.task_id = filter.task_id;
  }
  if (filter.description) {
    taskStepQuery.description = filter.description;
  }
  if (filter.time_due) {
    taskStepQuery.time_due = filter.time_due;
  }
  if (filter.estimated_duration) {
    taskStepQuery.estimated_duration = filter.estimated_duration;
  }
  if (filter.actual_duration) {
    taskStepQuery.actual_duration = filter.actual_duration;
  }
  if (filter.order) {
    taskStepQuery.order = filter.order;
  }
  return taskStepQuery;
}