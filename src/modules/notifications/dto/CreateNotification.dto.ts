import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
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
}
