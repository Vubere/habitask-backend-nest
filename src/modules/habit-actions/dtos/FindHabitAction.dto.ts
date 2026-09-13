import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindHabitActionDto {
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

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost_incurred?: number;

  @IsOptional()
  @IsBoolean()
  is_positive?: boolean;

  @IsOptional()
  @IsString()
  user_id?: string;
}
