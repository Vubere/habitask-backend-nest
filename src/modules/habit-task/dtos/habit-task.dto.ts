import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";


export class HabitTaskDTO {
  id: number;
  name: string;
  description: string;
  category: string;
  status: string;
  progress: number;
  streak?: number;
  created_at: string;
  updated_at: string;
}

export class HabitTaskFilterDTO {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_at_lte?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  created_at_gte?: string;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  search: string;
}