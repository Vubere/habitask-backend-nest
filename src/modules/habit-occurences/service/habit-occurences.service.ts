import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HabitOccurence } from '../../../typeorm/entities/HabitOccurence';
import { PaginationAndSort } from '../../../utils/types';
import {
  HabitOccurenceQueryType,
  HabitOccurenceSummaryType,
  HabitOccurenceType,
} from '../types';
import { Repository } from 'typeorm';
import { getSummaryExpression } from '../../../utils/helpers';

@Injectable()
export class HabitOccurencesService {
  constructor(
    @InjectRepository(HabitOccurence)
    private habitOccurenceRepository: Repository<HabitOccurence>,
  ) {}
  findHabitOccurence(id: string) {
    return this.habitOccurenceRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findHabitOccurences(
    filter: Partial<HabitOccurenceQueryType>,
    pagination: PaginationAndSort,
  ) {
    let query =
      this.habitOccurenceRepository.createQueryBuilder('habit_occurences');
    if (filter.search) {
      query = query.where(
        'habit_occurences.title LIKE :search OR habit_occurences.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('habit_occurences.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habit_occurences.date >= :date_gte', {
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
  getHabitOccurenceSummary(
    filter: Partial<HabitOccurenceQueryType>,
    pagination: PaginationAndSort,
  ): Promise<HabitOccurenceSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: habitOccurenceSummaryGroups,
    });
    let query =
      this.habitOccurenceRepository.createQueryBuilder('habit_occurences');
    if (filter.search) {
      query = query.where(
        'habit_occurences.title LIKE :search OR habit_occurences.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('habit_occurences.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('habit_occurences.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin(
        'users',
        'users',
        'habit_occurences.user_id = users.id',
      );
    }
    if (filter.group_by?.startsWith('habits.')) {
      query = query.innerJoin(
        'habits',
        'habits',
        'habit_occurences.habit_id = habits.id',
      );
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(habit_occurences.id) as count,
        MAX(habit_occurences.date) as last_habbit_date,
        Count(habits.is_positive) as positive_count,
        Count(habits.is_positive = 0) as negative_count,
        habit_occurences.user_id
      `,
      )
      .groupBy(groupExpr)
      .skip(pagination.page * pagination.per_page)
      .take(pagination.per_page)
      .getRawMany();
  }
  createHabitOccurence(habitOccurence: HabitOccurenceType) {
    const createdHabitOccurence =
      this.habitOccurenceRepository.create(habitOccurence);
    return this.habitOccurenceRepository.save(createdHabitOccurence);
  }
  async updateHabitOccurence(id: string, habitOccurence: HabitOccurenceType) {
    await this.habitOccurenceRepository.update(id, habitOccurence);
    return this.habitOccurenceRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteHabitOccurence(id: string) {
    return this.habitOccurenceRepository.delete(id);
  }
}

const habitOccurenceSummaryGroups: Record<string, string> = {
  created_at: 'habit_occurences.created_at',
  date: 'habit_occurences.date',
  habit_id: 'habit_occurences.habit_id',
  user_id: 'habit_occurences.user_id',
  category: 'habits.category',
  is_positive: 'habits.is_positive',
  habit_name: 'habits.habit_name',
  username: 'users.username',
};

function getQueryField(
  filter: Partial<HabitOccurenceQueryType>,
): Partial<HabitOccurenceType> {
  let habitOccurenceQuery: Partial<HabitOccurenceType> = {};
  if (filter.habit_id) {
    habitOccurenceQuery.habit_id = filter.habit_id;
  }
  if (filter.user_id) {
    habitOccurenceQuery.user_id = filter.user_id;
  }
  return habitOccurenceQuery;
}
