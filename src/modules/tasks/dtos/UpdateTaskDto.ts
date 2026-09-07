import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
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

  @IsNumber()
  @Type(() => Number)
  estimated_duration: number;

  @IsNumber()
  @Type(() => Number)
  actual_duration: number;
}