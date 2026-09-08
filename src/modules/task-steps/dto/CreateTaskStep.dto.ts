import { IsString } from "class-validator";

export class CreateTaskStepDto {
  @IsString()
  task_id: string;

  @IsString()
  description: string;

  @IsString()
  time_due: string;

  @IsString()
  estimated_duration: number;

  @IsString()
  order: number;
}