import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";


export class CreateTaskDto {
  @IsString()
  name: string;
  
  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  due_at: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completed_at: string;

  @IsOptional()
  @Type(() => Number)
  estimated_duration: number;

  @IsOptional()
  @Type(() => Number)
  actual_duration: number;
}