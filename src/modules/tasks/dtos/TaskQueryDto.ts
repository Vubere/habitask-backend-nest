import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { TaskDto } from "./TaskDto";

export class TaskQueryDto extends TaskDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completed_at_lte?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completed_at_gte?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_at_lte?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_at_gte?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estimated_duration_lte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  estimated_duration_gte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actual_duration_lte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actual_duration_gte?: number;

  @IsOptional()
  @IsString()
  group_by?: string;

  @IsOptional()
  @IsString()
  date_group?: string;
}
