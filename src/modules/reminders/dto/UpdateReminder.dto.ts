import { IsOptional, IsString } from "class-validator";

export class UpdateReminderDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  trigger: string;

  @IsOptional()
  @IsString()
  trigger_value: string;

  @IsOptional()
  @IsString()
  trigger_interval_unit: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  source_id: string;

  @IsOptional()
  @IsString()
  source_field: string;

  @IsOptional()
  @IsString()
  source_field_type: string;
}
