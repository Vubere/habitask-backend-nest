export type FrequencyKind = 'daily' | 'weekdays' | 'timesPerWeek';

export type Frequency =
  | { kind: 'daily' }
  | { kind: 'weekdays'; days: number[] }
  | { kind: 'timesPerWeek'; count: number };

export type Polarity = 'positive' | 'negative';

export type HabitType = {
  id: string;
  title: string;
  notes: string;
  icon: string;
  color: string;
  archived_at: Date | null;
  user_id: string;
  frequency_kind: FrequencyKind;
  frequency_days: string | null;
  frequency_count: number | null;
  start_date: string;
  target_per_day: number;
  reminder_time: string | null;
  polarity: Polarity;
};

export type HabitCreateType = {
  title: string;
  notes?: string;
  icon?: string;
  color?: string;
  user_id: string;
  frequency_kind?: FrequencyKind;
  frequency_days?: string | null;
  frequency_count?: number | null;
  start_date?: string;
  target_per_day?: number;
  reminder_time?: string | null;
  polarity?: Polarity;
};

export type HabitUpdateType = Partial<Omit<HabitType, 'id' | 'user_id'>> & {
  archived_at?: Date | null;
};

export type HabitQueryType = {
  search?: string;
  date_lte?: string;
  date_gte?: string;
  group_by?: string;
  date_group?: string;
  archived?: boolean;
} & Partial<HabitType>;

export type HabitSummaryType = {
  label: string;
  count: number;
  positive_count: number;
  negative_count: number;
  target_total: number;
};
