import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateHabitDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  frequency_kind?: "daily" | "weekdays" | "timesPerWeek";

  @IsOptional()
  @IsString()
  frequency_days?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  frequency_count?: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  target_per_day?: number;

  @IsOptional()
  @IsString()
  reminder_time?: string;

  @IsOptional()
  @IsString()
  polarity?: "positive" | "negative";
}
