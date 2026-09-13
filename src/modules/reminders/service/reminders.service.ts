import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reminder } from '../../../typeorm/entities/Reminder';
import { Repository } from 'typeorm';
import { getOffset } from '../../../utils/helpers';
import { ReminderCreateType, ReminderQueryType, ReminderUpdateType } from '../types';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {}

  findReminder(id: string) {
    return this.reminderRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  findReminders(filter: Partial<ReminderQueryType>, pagination: any) {
    let query = this.reminderRepository.createQueryBuilder('reminders');
    if (filter.search) {
      query = query.where(
        'reminders.title LIKE :search OR reminders.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('reminders.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('reminders.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }
    return query
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .orderBy(pagination.sort_by, pagination.sort_direction)
      .getMany();
  }
  createReminder(reminder: ReminderCreateType) {
    const createdReminder = this.reminderRepository.create(reminder);
    return this.reminderRepository.save(createdReminder);
  }
  async updateReminder(id: string, reminder: ReminderUpdateType) {
    await this.reminderRepository.update(id, reminder);
    return this.reminderRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteReminder(id: string) {
    return this.reminderRepository.delete(id);
  }
}

function getQueryField(filter: Partial<Reminder>): Partial<Reminder> {
  let reminderQuery: Partial<Reminder> = {};
  if (filter.title) {
    reminderQuery.title = filter.title;
  }
  if (filter.description) {
    reminderQuery.description = filter.description;
  }
  if (filter.purpose) {
    reminderQuery.purpose = filter.purpose;
  }
  if (filter.category) {
    reminderQuery.category = filter.category;
  }
  if (filter.trigger) {
    reminderQuery.trigger = filter.trigger;
  }
  if (filter.trigger_value) {
    reminderQuery.trigger_value = filter.trigger_value;
  }
  if (filter.trigger_interval_unit) {
    reminderQuery.trigger_interval_unit = filter.trigger_interval_unit;
  }
  if (filter.source) {
    reminderQuery.source = filter.source;
  }
  if (filter.source_id) {
    reminderQuery.source_id = filter.source_id;
  }
  if (filter.source_field) {
    reminderQuery.source_field = filter.source_field;
  }
  if (filter.source_field_type) {
    reminderQuery.source_field_type = filter.source_field_type;
  }
  return reminderQuery;
}
