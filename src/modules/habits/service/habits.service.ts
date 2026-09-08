import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Habit } from "../../../typeorm/entities/Habit";
import { Repository } from "typeorm";
import { getSummaryExpression } from "../../../utils/helpers";
import { HabitQueryType, HabitSummaryType, HabitType } from "../types";
import { PaginationAndSort } from "../../../utils/types";

@Injectable()
export class HabitsService {
  constructor(@InjectRepository(Habit) private habitRepository: Repository<Habit>) {}
  findHabit(id: string) {
    return this.habitRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findHabits(filter: HabitQueryType, pagination: PaginationAndSort) {
    let query = this.habitRepository.createQueryBuilder('habits');
    if (filter.search) {
      query = query.where(
        'habits.name LIKE :search OR habits.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('habits.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habits.date >= :date_gte', {
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
  getHabitSummary(filter: HabitQueryType, pagination: PaginationAndSort): Promise<HabitSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: habitSummaryGroups,
    });
    let query = this.habitRepository.createQueryBuilder('habits');
    if (filter.search) {
      query = query.where(
        'habits.name LIKE :search OR habits.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('habits.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habits.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'habits.user_id = users.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(habits.id) as count,
        SUM(habits.is_positive) as positive_count,
        SUM(habits.is_positive = 0) as negative_count,
        MAX(habits.date) as last_habit_date
      `,
      )
      .groupBy(groupExpr)
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .getRawMany();
  }
  createHabit(habit: HabitType) {
    const createdHabit = this.habitRepository.create(habit);
    return this.habitRepository.save(createdHabit);
  }
  async updateHabit(id: string, habit: HabitType) {
    await this.habitRepository.update(id, habit);
    return this.habitRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteHabit(id: string) {
    return this.habitRepository.delete(id);
  }
}


function getQueryField(filter: Partial<HabitQueryType>): Partial<HabitType> {
  let habitQuery: Partial<HabitType> = {};
  if (filter.name) {
    habitQuery.name = filter.name;
  }
  if (filter.description) {
    habitQuery.description = filter.description;
  }
  if (filter.category) {
    habitQuery.category = filter.category;
  }
  if (filter.pros) {
    habitQuery.pros = filter.pros;
  }
  if (filter.cons) {
    habitQuery.cons = filter.cons;
  }
  if (filter.is_positive) {
    habitQuery.is_positive = filter.is_positive;
  }
  if (filter.last_done) {
    habitQuery.last_done = filter.last_done;
  }
  return habitQuery;
}

const habitSummaryGroups: Record<string, string> = {
  created_at: 'habits.created_at',
  date: 'habits.date',
  name: 'habits.name',
  category: 'habits.category',
  pros: 'habits.pros',
  cons: 'habits.cons',
  is_positive: 'habits.is_positive',
  last_done: 'habits.last_done',
  user_id: 'habits.user_id',
  username: 'users.username',
};