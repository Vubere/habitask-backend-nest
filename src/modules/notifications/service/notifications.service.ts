import { Inject, Injectable } from '@nestjs/common';
import { getOffset, getSummaryExpression } from "../../../utils/helpers";
import { NotificationQueryType, NotificationSummaryType, NotificationType } from "../types";
import { PaginationAndSort } from "../../../utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../../../typeorm/entities/Notification";

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}
  findNotification(id: string) {
    return this.notificationRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findNotifications(filter: NotificationQueryType, pagination: PaginationAndSort) {
    let query = this.notificationRepository.createQueryBuilder('notifications');
    if (filter.search) {
      query = query.where(
        'notifications.title LIKE :search OR notifications.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('notifications.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('notifications.date >= :date_gte', {
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
  async getNotificationSummary(filter: NotificationQueryType, pagination: PaginationAndSort):Promise<NotificationSummaryType[]> {
    const groupExpr = getSummaryExpression({
      GroupBy: filter.group_by!,
      DateGroup: filter.date_group!,
      Field: filter.group_by!,
      AllowedGrouping: notificationSummaryGroups,
    });
    let query = this.notificationRepository.createQueryBuilder('notifications');
    if (filter.search) {
      query = query.where(
        'notifications.title LIKE :search OR notifications.description LIKE :search',
        {
          search: `%${filter.search}%`,
        },
      );
    }
    if (filter.date_lte) {
      query = query.andWhere('notifications.date <= :date_lte', {
        date_lte: filter.date_lte,
      });
    }
    if (filter.date_gte) {
      query = query.andWhere('notifications.date >= :date_gte', {
        date_gte: filter.date_gte,
      });
    }
    const whereFields = getQueryField(filter);
    if (Object.keys(whereFields).length > 0) {
      query = query.andWhere(whereFields);
    }
    if (filter.group_by?.startsWith('users.')) {
      query = query.innerJoin('users', 'users', 'notifications.user_id = users.id');
    }
    return query
      .select(
        `
        ${groupExpr} as label,
        COUNT(notifications.id) as count,
        MAX(notifications.date) as last_notification_date,
        Count(notifications.is_read = 0) as unread_count
      `,
      )
      .groupBy(groupExpr)
      .skip(getOffset(pagination.page, pagination.per_page))
      .take(pagination.per_page)
      .getRawMany();
  }

  async markAsRead(id: string) {
    return this.notificationRepository.update(id, {
      is_read: true,
    });
  }
  async markAllAsRead(userId: string) {
    return this.notificationRepository.update({
      user_id: userId,
    }, {
      is_read: true,
    });
  }
  createNotification(notification: NotificationType) {
    const createdNotification = this.notificationRepository.create(notification);
    return this.notificationRepository.save(createdNotification);
  }
  async updateNotification(id: string, notification: NotificationType) {
    await this.notificationRepository.update(id, notification);
    return this.notificationRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  deleteNotification(id: string) {
    return this.notificationRepository.delete(id);
  }
}

const notificationSummaryGroups: Record<string, string> = {
  created_at: 'notifications.created_at',
  date: 'notifications.date',
  title: 'notifications.title',
  category: 'notifications.category',
  is_read: 'notifications.is_read',
  user_id: 'notifications.user_id',
  username: 'users.username',
};

function getQueryField(filter: Partial<NotificationQueryType>): Partial<NotificationType> {
  let notificationQuery: Partial<NotificationType> = {};
  if (filter.title) {
    notificationQuery.title = filter.title;
  }
  if (filter.description) {
    notificationQuery.description = filter.description;
  }
  if (filter.category) {
    notificationQuery.category = filter.category;
  }
  if (filter.source) {
    notificationQuery.source = filter.source;
  }
  if (filter.source_id) {
    notificationQuery.source_id = filter.source_id;
  }
  return notificationQuery;
}