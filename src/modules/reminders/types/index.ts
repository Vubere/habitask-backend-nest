
export type ReminderType = {
  id: string;
  title: string;
  description: string;
  purpose: string;
  category: string;
  trigger: string;
  trigger_value: string;
  trigger_interval_unit: string;
  source: string;
  source_id: string;
  source_field: string;
  source_field_type: string;
  user_id: string;
  is_read: boolean;
}

export type ReminderCreateType = {
  title: string;
  description: string;
  purpose: string;
  category: string;
  trigger: string;
  trigger_value: string;
  trigger_interval_unit: string;
  source: string;
  source_id: string;
  source_field: string;
  source_field_type: string;
  user_id: string;
}

export type ReminderUpdateType = {
  title?: string;
  description?: string;
  purpose?: string;
  category?: string;
  trigger?: string;
  trigger_value?: string;
  trigger_interval_unit?: string;
  source?: string;
  source_id?: string;
  source_field?: string;
  source_field_type?: string;
}

export type ReminderCompleteType = {
  is_read: boolean;
}

export type ReminderQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
} & ReminderType;