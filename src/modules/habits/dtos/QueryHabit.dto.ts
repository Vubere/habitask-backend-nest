import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class HabitQueryDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  polarity: "positive" | "negative";

  @IsOptional()
  @IsString()
  date_lte: string;

  @IsOptional()
  @IsString()
  date_gte: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  archived: boolean;

  @IsOptional()
  @IsString()
  group_by: string;

  @IsOptional()
  @IsString()
  date_group: string;
}
