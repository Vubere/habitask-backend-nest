import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateHabitCompletionDto {
  @IsString()
  habit_id: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  count?: number;
}

export class UpdateHabitCompletionDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  count?: number;
}

export class QueryHabitCompletionDto {
  @IsOptional()
  @IsString()
  habit_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  date_lte?: string;

  @IsOptional()
  @IsString()
  date_gte?: string;

  @IsOptional()
  @IsString()
  group_by?: string;

  @IsOptional()
  @IsString()
  date_group?: string;
}
