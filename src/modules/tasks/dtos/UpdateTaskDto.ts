import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Subtask } from '../types';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

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
  status?: "todo" | "done";

  @IsOptional()
  @IsString()
  due_date?: string;

  @IsOptional()
  @IsString()
  due_time?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsArray()
  subtasks?: Subtask[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  archived?: boolean;
}
