import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HabitTaskQuery, HabitTaskType } from '../types';
import { PaginationAndSortDto } from '../../general/dtos/pagination_and_sort_dto';
import { PaginationAndSort } from '../../general/types';
import { getOffset } from '../../../utils/helpers';

@Injectable()
export class HabitTaskService {
  constructor(private readonly dataSource: DataSource) {}

  async getHabitTaskDisplayDetails(
    filter: HabitTaskQuery,
    pagination: PaginationAndSort,
    search?: string,
  ): Promise<HabitTaskType[]> {
    let query = `
      SELECT *
      FROM (
        SELECT
          habits.id AS id,
          habits.name AS name,
          habits.description AS description,
          habits.category AS category,
          habits.status AS status,
          (SELECT COUNT(*) FROM habit_actions WHERE habit_actions.habit_id = habits.id AND habit_actions.is_done = 1) AS progress,
				  (SELECT COUNT(*) FROM habit_actions WHERE habit_actions.habit_id = habits.id) AS steps,
          habits.streak AS streak,
          habits.created_at AS created_at,
          habits.updated_at AS updated_at
        FROM habits
        WHERE habits.user_id = ?

        UNION ALL

        SELECT
          tasks.id AS id,
          tasks.name AS name,
          tasks.description AS description,
          tasks.category AS category,
          tasks.status AS status,
          (SELECT COUNT(*) FROM task_steps WHERE task_steps.task_id = tasks.id AND task_steps.is_done = 1) AS progress,
				  (SELECT COUNT(*) FROM task_steps WHERE task_steps.task_id = tasks.id) AS steps,
          NULL AS streak,
          tasks.created_at AS created_at,
          tasks.updated_at AS updated_at
        FROM tasks
        WHERE tasks.user_id = ?
      ) AS habit_tasks

      WHERE 1 = 1
      OFFSET ?
      LIMIT ?
    `;

    const params: any[] = [
      filter.user_id,
      filter.user_id,
      getOffset(pagination.page, pagination.per_page),
      pagination.per_page,
    ];

    if (filter.created_at_gte) {
      query += ` AND habit_tasks.created_at >= ?`;
      params.push(filter.created_at_gte);
    }

    if (filter.created_at_lte) {
      query += ` AND habit_tasks.created_at <= ?`;
      params.push(filter.created_at_lte);
    }

    if (search) {
      query += `
        AND (
          habit_tasks.name LIKE ?
          OR habit_tasks.description LIKE ?
          OR habit_tasks.category LIKE ?
        )
      `;

      const searchValue = `%${search}%`;

      params.push(searchValue, searchValue, searchValue);
    }

    query += `
      ORDER BY habit_tasks.created_at DESC
    `;

    return this.dataSource.query(query, params);
  }
}
