import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitCompletion } from '../../../typeorm/entities/HabitCompletion';
import { Habit } from '../../../typeorm/entities/Habit';
import {
  HabitCompletionCreateType,
  HabitCompletionQueryType,
  HabitCompletionUpdateType,
  HabitStatsType,
} from '../types';
import { PaginationAndSort } from '../../../utils/types';
import { getOffset, getSummaryExpression } from '../../../utils/helpers';

@Injectable()
export class HabitCompletionsService {
  constructor(
    @InjectRepository(HabitCompletion)
    private completionRepository: Repository<HabitCompletion>,
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
  ) {}

  findCompletions(filter: HabitCompletionQueryType, pagination: PaginationAndSort) {
    let query = this.completionRepository.createQueryBuilder('habit_completions');
    if (filter.habit_id) {
      query = query.andWhere('habit_completions.habit_id = :habit_id', {
        habit_id: filter.habit_id,
      });
    }
    if (filter.user_id) {
      query = query.andWhere('habit_completions.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (filter.date_lte) {
      query = query.andWhere('habit_completions.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habit_completions.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    return query
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .orderBy('habit_completions.' + pagination.sort_by, pagination.sort_direction)
      .getMany();
  }

  findCompletion(id: string) {
    return this.completionRepository.findOne({ where: { id } });
  }

  getCompletionSummary(filter: HabitCompletionQueryType, pagination: PaginationAndSort) {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: completionSummaryGroups,
    });
    let query = this.completionRepository.createQueryBuilder('habit_completions');
    if (filter.user_id) {
      query = query.andWhere('habit_completions.user_id = :user_id', {
        user_id: filter.user_id,
      });
    }
    if (groupExpr.startsWith('habits.')) {
      query = query.innerJoin('habits', 'habits', 'habit_completions.habit_id = habits.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(habit_completions.id) as count,
        SUM(habit_completions.count) as total_count,
        MAX(habit_completions.date) as last_habit_date
      `,
      )
      .groupBy(groupExpr)
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .getRawMany();
  }

  async createCompletion(completion: HabitCompletionCreateType) {
    const payload = {
      ...completion,
      date: completion.date ?? new Date().toISOString().slice(0, 10),
      count: completion.count ?? 0,
      completed_at: completion.completed_at ?? new Date(),
    };
    const created = this.completionRepository.create(payload);
    return this.completionRepository.save(created);
  }

  async logCompletion(habitId: string, userId: string, date?: string, count?: number) {
    const day = date ?? new Date().toISOString().slice(0, 10);
    const existing = await this.completionRepository.findOne({
      where: { habit_id: habitId, date: day },
    });
    if (existing) {
      existing.count = count ?? existing.count;
      existing.completed_at = new Date();
      return this.completionRepository.save(existing);
    }
    const created = this.completionRepository.create({
      habit_id: habitId,
      user_id: userId,
      date: day,
      count: count ?? 0,
      completed_at: new Date(),
    });
    return this.completionRepository.save(created);
  }

  async updateCompletion(id: string, completion: HabitCompletionUpdateType) {
    await this.completionRepository.update(id, completion);
    return this.completionRepository.findOne({ where: { id } });
  }

  deleteCompletion(id: string) {
    return this.completionRepository.delete(id);
  }

  async getHabitStats(id: string): Promise<HabitStatsType> {
    const habit = await this.habitRepository.findOne({ where: { id } });
    if (!habit) {
      throw new Error('habit not found');
    }
    const completions = await this.completionRepository.find({
      where: { habit_id: id },
      order: { date: 'ASC' },
    });
    return computeHabitStats(habit, completions);
  }
}

function computeHabitStats(
  habit: Habit,
  completions: HabitCompletion[],
): HabitStatsType {
  const perDay: Record<string, number> = {};
  for (const c of completions) {
    const key = String(c.date).slice(0, 10);
    perDay[key] = (perDay[key] ?? 0) + c.count;
  }
  const target = habit.target_per_day > 0 ? habit.target_per_day : 1;
  const start = new Date(String(habit.start_date).slice(0, 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const keyOf = (d: Date) => d.toISOString().slice(0, 10);
  const isComplete = (d: Date) => (perDay[keyOf(d)] ?? 0) >= target;

  let best = 0;
  let run = 0;
  let total = 0;
  let done = 0;
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    total++;
    if (isComplete(d)) {
      run++;
      done++;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }

  let current = 0;
  const cursor = new Date(today);
  if (!isComplete(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (cursor >= start && isComplete(cursor)) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    current_streak: current,
    best_streak: best,
    completion_rate: total > 0 ? done / total : 0,
  };
}

const completionSummaryGroups: Record<string, string> = {
  created_at: 'habit_completions.created_at',
  date: 'habit_completions.date',
  habit_id: 'habit_completions.habit_id',
  user_id: 'habit_completions.user_id',
  habit_title: 'habits.title',
};
