import { Inject, Injectable } from '@nestjs/common';
import { getOffset } from "../../../utils/helpers";
import { NotificationQueryType, NotificationType } from "../types";
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