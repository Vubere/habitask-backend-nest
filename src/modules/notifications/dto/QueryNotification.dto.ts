import { IsOptional, IsString } from "class-validator";

export class QueryNotificationDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  date_lte: string;

  @IsOptional()
  @IsString()
  date_gte: string;

  @IsOptional()
  @IsString()
  group_by: string;

  @IsOptional()
  @IsString()
  date_group: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  source_id: string;

  @IsOptional()
  @IsString()
  user_id: string;
}
