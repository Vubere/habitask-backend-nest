import { IsOptional, IsString } from "class-validator";

export class CreateReminderDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  purpose: string;

  @IsString()
  category: string;

  @IsString()
  trigger: string;

  @IsString()
  trigger_value: string;

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
