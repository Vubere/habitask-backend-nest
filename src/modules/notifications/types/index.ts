
export type NotificationType = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  is_read: boolean;
  source: string;
  source_id: string;
  user_id: string;
}

export type NotificationCreateType = {
  title: string;
  description: string;
  category: string;
  date: string;
  is_read: boolean;
  source: string;
  source_id: string;
  user_id: string;
}

export type NotificationUpdateType = {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  is_read?: boolean;
  source?: string;
  source_id?: string;
}

export type NotificationSummaryType = {
  label: string;
  count: number;
  last_notification_date: string;
  unread_count: number;
}

export type NotificationCompleteType = {
  is_read: boolean;
}

export type NotificationQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
} & Partial<NotificationType>;