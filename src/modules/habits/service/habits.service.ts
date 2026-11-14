import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../../../typeorm/entities/Habit';
import {
  HabitCreateType,
  HabitQueryType,
  HabitSummaryType,
  HabitUpdateType,
} from '../types';
import { PaginationAndSort } from '../../../utils/types';
import { getOffset, getSummaryExpression } from '../../../utils/helpers';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit) private habitRepository: Repository<Habit>,
  ) {}

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
        '(habits.title LIKE :search OR habits.notes LIKE :search)',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.user_id) {
      query = query.andWhere('habits.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.polarity) {
      query = query.andWhere('habits.polarity = :polarity', {
        polarity: filter.polarity,
      });
    }
    if (filter.date_lte) {
      query = query.andWhere('habits.created_at <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habits.created_at >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    if (filter.archived === true) {
      query = query.andWhere('habits.archived_at IS NOT NULL');
    } else {
      query = query.andWhere('habits.archived_at IS NULL');
    }
    return query
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .orderBy(
        `habits.${pagination.sort_by || 'created_at'}`,
        pagination.sort_direction || 'DESC',
      )
      .getMany();
  }

  getHabitSummary(
    filter: HabitQueryType,
    pagination: PaginationAndSort,
  ): Promise<HabitSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: habitSummaryGroups,
    });
    let query = this.habitRepository.createQueryBuilder('habits');
    if (filter.user_id) {
      query = query.andWhere('habits.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.search) {
      query = query.andWhere(
        '(habits.title LIKE :search OR habits.notes LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }
    if (groupExpr.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'habits.user_id = users.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(habits.id) as count,
        SUM(habits.polarity = 'positive') as positive_count,
        SUM(habits.polarity = 'negative') as negative_count,
        SUM(habits.target_per_day) as target_total
      `,
      )
      .groupBy(groupExpr)
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .getRawMany();
  }

  createHabit(habit: HabitCreateType) {
    const payload = {
      ...habit,
      frequency_kind: habit.frequency_kind ?? 'daily',
      start_date: habit.start_date ?? new Date().toISOString().slice(0, 10),
      target_per_day: habit.target_per_day ?? 1,
      polarity: habit.polarity ?? 'positive',
    };
    const createdHabit = this.habitRepository.create(payload);
    return this.habitRepository.save(createdHabit);
  }

  async updateHabit(id: string, habit: HabitUpdateType) {
    const { archived, ...rest } = habit as HabitUpdateType & { archived?: boolean };
    await this.habitRepository.update(id, rest);
    if (archived !== undefined) {
      await this.habitRepository.update(id, {
        archived_at: archived ? new Date() : null,
      });
    }
    return this.findHabit(id);
  }

  deleteHabit(id: string) {
    return this.habitRepository.update(id, { archived_at: new Date() });
  }
}

const habitSummaryGroups: Record<string, string> = {
  created_at: 'habits.created_at',
  start_date: 'habits.start_date',
  title: 'habits.title',
  polarity: 'habits.polarity',
  user_id: 'habits.user_id',
  username: 'users.username',
};
