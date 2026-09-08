import { HabitActionQueryType, HabitActionType } from './../types/index';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { HabitAction } from "../../../typeorm/entities/HabitAction";
import { Repository } from "typeorm";
import { PaginationAndSort } from "../../../utils/types";
import { getSummaryExpression } from "../../../utils/helpers";

@Injectable()
export class HabitActionsService {
  constructor(@InjectRepository(HabitAction) private habitActionRepository: Repository<HabitAction>) {}
  findHabitAction(id: string) {
    return this.habitActionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findHabitActions(filter: HabitActionQueryType, pagination: PaginationAndSort) {
    let query = this.habitActionRepository.createQueryBuilder('habit_actions');
    if (filter.search) {
      query = query.where(
        'habit_actions.title LIKE :search OR habit_actions.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }

    if (filter.date_lte) {
      query = query.andWhere('habit_actions.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habit_actions.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }

    return query
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .orderBy(pagination.sort_by, pagination.sort_direction)
      .getMany();
  }
  getHabitActionSummary(filter: HabitActionQueryType, pagination: PaginationAndSort) {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: habitActionSummaryGroups,
    });
    let query = this.habitActionRepository.createQueryBuilder('habit_actions');
    if (filter.search) {
      query = query.where(
        'habit_actions.title LIKE :search OR habit_actions.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('habit_actions.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habit_actions.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'habit_actions.user_id = users.id');
    }
    if (filter.group_by?.startsWith('habits.')) {
      query = query.innerJoin('habits', 'habits', 'habit_actions.habit_id = habits.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(habit_actions.id) as count,
        SUM(habit_actions.cost_incurred) as cost_incurred
      `,
      )
      .groupBy(groupExpr)
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .getRawMany();
  }
  createHabitAction(habitAction: HabitActionType) {
    const createdHabitAction = this.habitActionRepository.create(habitAction);
    return this.habitActionRepository.save(createdHabitAction);
  }
  async updateHabitAction(id: string, habitAction: HabitActionType) {
    await this.habitActionRepository.update(id, habitAction);
    return this.habitActionRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteHabitAction(id: string) {
    return this.habitActionRepository.delete(id);
  }
}

function getQueryField(filter: Partial<HabitActionQueryType>): Partial<HabitActionType> {
  let habitActionQuery: Partial<HabitActionType> = {};
  if (filter.title) {
    habitActionQuery.title = filter.title;
  }
  if (filter.description) {
    habitActionQuery.description = filter.description;
  }
  if (filter.category) {
    habitActionQuery.category = filter.category;
  }
  if (filter.cost_incurred) {
    habitActionQuery.cost_incurred = filter.cost_incurred;
  }
  if (filter.is_positive) {
    habitActionQuery.is_positive = filter.is_positive;
  }
  return habitActionQuery;
}

const habitActionSummaryGroups: Record<string, string> = {
  created_at: 'habit_actions.created_at',
  date: 'habit_actions.date',
  title: 'habit_actions.title',
  category: 'habit_actions.category',
  cost_incurred: 'habit_actions.cost_incurred',
  is_positive: 'habit_actions.is_positive',
  user_id: 'habit_actions.user_id',
  username: 'users.username',
  habit_id: 'habit_actions.habit_id',
  habit_name: 'habits.habit_name',
};