import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export class UserQueryDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  admin: boolean;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  profession: string;
}