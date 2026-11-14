import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { TaskDto } from './TaskDto';

export class TaskQueryDto extends TaskDto {
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
  @Type(() => Boolean)
  @IsBoolean()
  archived?: boolean;
}
