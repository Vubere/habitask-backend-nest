import { IsOptional, IsString } from "class-validator";


export class FindHabitOccurenceQuery {
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
  date_group?:string;

  @IsOptional()
  @IsString()
  id?:string;

  @IsOptional()
  @IsString()
  habit_id?:string;

  @IsOptional()
  @IsString()
  user_id?:string;
}