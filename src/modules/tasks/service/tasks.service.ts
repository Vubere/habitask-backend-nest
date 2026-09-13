import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../../typeorm/entities/Task';
import { Repository } from 'typeorm';
import { TaskCreateType, TaskQueryType, TaskSummaryType, TaskType, TaskUpdateType } from '../types';
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
        'tasks.name LIKE :search OR tasks.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.completed_at_lte) {
      query = query.andWhere('tasks.completed_at <= :completed_at_lte', {
        completed_at_lte: filter.completed_at_lte,
      });
    }
    if (filter.completed_at_gte) {
      query = query.andWhere('tasks.completed_at >= :completed_at_gte', {
        completed_at_gte: filter.completed_at_gte,
      });
    }
    if (filter.due_at_lte) {
      query = query.andWhere('tasks.due_at <= :due_at_lte', {
        due_at_lte: filter.due_at_lte,
      });
    }
    if (filter.due_at_gte) {
      query = query.andWhere('tasks.due_at >= :due_at_gte', {
        due_at_gte: filter.due_at_gte,
      });
    }
    if (filter.estimated_duration_lte) {
      query = query.andWhere(
        'tasks.estimated_duration <= :estimated_duration_lte',
        {
          estimated_duration_lte: filter.estimated_duration_lte,
        },
      );
    }
    if (filter.estimated_duration_gte) {
      query = query.andWhere(
        'tasks.estimated_duration >= :estimated_duration_gte',
        {
          estimated_duration_gte: filter.estimated_duration_gte,
        },
      );
    }
    if (filter.actual_duration_lte) {
      query = query.andWhere('tasks.actual_duration <= :actual_duration_lte', {
        actual_duration_lte: filter.actual_duration_lte,
      });
    }
    if (filter.actual_duration_gte) {
      query = query.andWhere('tasks.actual_duration >= :actual_duration_gte', {
        actual_duration_gte: filter.actual_duration_gte,
      });
    }
    const taskQuery: Partial<TaskQueryType> = getTaskQueryMainFields(filter);
    if (Object.keys(taskQuery).length > 0) {
      query = query.andWhere(taskQuery);
    }
    return query
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .orderBy(pagination.sort_by, pagination.sort_direction)
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
  findTaskSummary(filter: TaskQueryType, pagination: PaginationAndSort): Promise<TaskSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: taskSummaryGroups,
    });
    let query = this.taskRepository.createQueryBuilder('tasks');
    if (filter.search) {
      query = query.where(
        'tasks.name LIKE :search OR tasks.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.completed_at_lte) {
      query = query.andWhere('tasks.completed_at <= :completed_at_lte', {
        completed_at_lte: filter.completed_at_lte,
      });
    }
    if (filter.completed_at_gte) {
      query = query.andWhere('tasks.completed_at >= :completed_at_gte', {
        completed_at_gte: filter.completed_at_gte,
      });
    }
    if (filter.due_at_lte) {
      query = query.andWhere('tasks.due_at <= :due_at_lte', {
        due_at_lte: filter.due_at_lte,
      });
    }
    if (filter.due_at_gte) {
      query = query.andWhere('tasks.due_at >= :due_at_gte', {
        due_at_gte: filter.due_at_gte,
      });
    }
    if (filter.estimated_duration_lte) {
      query = query.andWhere(
        'tasks.estimated_duration <= :estimated_duration_lte',
        {
          estimated_duration_lte: filter.estimated_duration_lte,
        },
      );
    }
    if (filter.estimated_duration_gte) {
      query = query.andWhere(
        'tasks.estimated_duration >= :estimated_duration_gte',
        {
          estimated_duration_gte: filter.estimated_duration_gte,
        },
      );
    }
    if (filter.actual_duration_lte) {
      query = query.andWhere('tasks.actual_duration <= :actual_duration_lte', {
        actual_duration_lte: filter.actual_duration_lte,
      });
    }
    if (filter.actual_duration_gte) {
      query = query.andWhere('tasks.actual_duration >= :actual_duration_gte', {
        actual_duration_gte: filter.actual_duration_gte,
      });
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'tasks.user_id = users.id');
    }
    const taskQuery: Partial<TaskQueryType> = getTaskQueryMainFields(filter);
    if (Object.keys(taskQuery).length > 0) {
      query = query.andWhere(taskQuery);
    }

    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(tasks.id) as count,
        SUM(tasks.is_completed) as completed_count,
        SUM(tasks.is_completed = 0) as incomplete_count,
        MAX(tasks.due_at) as due_count,
        MAX(tasks.completed_at) as last_task_date
      `,
      )
      .groupBy(groupExpr)
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .getRawMany();
  }
  createTask(task: TaskCreateType) {
    const createdTask = this.taskRepository.create(task);
    return this.taskRepository.save(createdTask);
  }
  async updateTask(id: string, task: TaskUpdateType) {
    await this.taskRepository.update(id, task);
    return this.taskRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteTask(id: string) {
    return this.taskRepository.delete(id);
  }
}

const taskSummaryGroups: Record<string, string> = {
  created_at: 'tasks.created_at',
  due_at: 'tasks.due_at',
  name: 'tasks.name',
  category: 'tasks.category',
  priority: 'tasks.priority',
  is_completed: 'tasks.is_completed',
  completed_at: 'tasks.completed_at',
  user_id: 'tasks.user_id',
  username: 'users.username',
};

function getTaskQueryMainFields(
  filter: Partial<TaskQueryType>,
): Partial<TaskType> {
  let taskQuery: Partial<TaskType> = {};
  if (filter.name) {
    taskQuery.name = filter.name;
  }
  if (filter.description) {
    taskQuery.description = filter.description;
  }
  if (filter.category) {
    taskQuery.category = filter.category;
  }
  if (filter.completed_at) {
    taskQuery.completed_at = filter.completed_at;
  }
  if (filter.due_at) {
    taskQuery.due_at = filter.due_at;
  }
  if (filter.estimated_duration) {
    taskQuery.estimated_duration = filter.estimated_duration;
  }
  if (filter.actual_duration) {
    taskQuery.actual_duration = filter.actual_duration;
  }
  if (filter.user_id) {
    taskQuery.user_id = filter.user_id;
  }
  if (filter.priority) {
    taskQuery.priority = filter.priority;
  }
  return taskQuery;
}
