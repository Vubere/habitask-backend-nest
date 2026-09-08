import { IsOptional, IsString } from "class-validator";

export class QueryTaskStepDto {
  @IsString()
  task_id: string;

  @IsString()
  description: string;

  @IsString()
  time_due: string;

  @IsString()
  estimated_duration: number;

  @IsString()
  actual_duration: number;

  @IsOptional()
  @IsString()
  order: number;
}