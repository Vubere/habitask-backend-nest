import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../../typeorm/entities/Task';
import {
  TaskCreateType,
  TaskQueryType,
  TaskSummaryType,
  TaskUpdateType,
} from '../types';
import { PaginationAndSort } from '../../../utils/types';
import { getOffset, getSummaryExpression } from '../../../utils/helpers';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  findTasks(filter: TaskQueryType, pagination: PaginationAndSort) {
    let query = this.taskRepository.createQueryBuilder('tasks');
    if (filter.search) {
      query = query.where(
        '(tasks.title LIKE :search OR tasks.notes LIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.user_id) {
      query = query.andWhere('tasks.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.status) {
      query = query.andWhere('tasks.status = :status', {
        status: filter.status,
      });
    }
    if (filter.priority) {
      query = query.andWhere('tasks.priority = :priority', {
        priority: filter.priority,
      });
    }
    if (filter.date_lte) {
      query = query.andWhere('tasks.created_at <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('tasks.created_at >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    if (filter.archived === true) {
      query = query.andWhere('tasks.archived_at IS NOT NULL');
    } else {
      query = query.andWhere('tasks.archived_at IS NULL');
    }
    return query
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .orderBy(
        `tasks.${pagination.sort_by || 'created_at'}`,
        pagination.sort_direction || 'DESC',
      )
      .getMany();
  }

  findTasksById(id: string) {
    return this.taskRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  findTasksByUserId(id: string) {
    return this.taskRepository.find({
      where: {
        user_id: id,
      },
    });
  }

  findTaskSummary(
    filter: TaskQueryType,
    pagination: PaginationAndSort,
  ): Promise<TaskSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: taskSummaryGroups,
    });
    let query = this.taskRepository.createQueryBuilder('tasks');
    if (filter.user_id) {
      query = query.andWhere('tasks.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.search) {
      query = query.andWhere(
        '(tasks.title LIKE :search OR tasks.notes LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }
    if (groupExpr.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'tasks.user_id = users.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(tasks.id) as count,
        SUM(tasks.status = 'done') as completed_count,
        SUM(tasks.status = 'todo') as incomplete_count,
        SUM(tasks.due_date IS NOT NULL) as due_count,
        MAX(tasks.completed_at) as last_task_date
      `,
      )
      .groupBy(groupExpr)
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .getRawMany();
  }

  createTask(task: TaskCreateType) {
    const payload = {
      ...task,
      status: task.status ?? 'todo',
      priority: task.priority ?? 'none',
      subtasks: task.subtasks ?? [],
    };
    const createdTask = this.taskRepository.create(payload);
    return this.taskRepository.save(createdTask);
  }

  async updateTask(id: string, task: TaskUpdateType) {
    const { archived, ...rest } = task;
    if (rest.status === 'done' && !rest.completed_at) {
      rest.completed_at = new Date();
    }
    await this.taskRepository.update(id, rest);
    if (archived !== undefined) {
      await this.taskRepository.update(id, {
        archived_at: archived ? new Date() : null,
      });
    }
    return this.findTasksById(id);
  }

  deleteTask(id: string) {
    return this.taskRepository.update(id, { archived_at: new Date() });
  }
}

const taskSummaryGroups: Record<string, string> = {
  created_at: 'tasks.created_at',
  due_date: 'tasks.due_date',
  title: 'tasks.title',
  priority: 'tasks.priority',
  status: 'tasks.status',
  completed_at: 'tasks.completed_at',
  user_id: 'tasks.user_id',
  username: 'users.username',
};
