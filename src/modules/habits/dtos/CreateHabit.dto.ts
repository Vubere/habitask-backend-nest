import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class CreateHabitDto {
   @IsString()
   name: string;

   @IsString()
   description: string;

   @IsString()
   category: string;

   @IsString()
   pros: string;

   @IsString()
   cons: string;

   @IsOptional()
   @Type(()=>Boolean)
   @IsBoolean()
   is_positive?: boolean;

   @IsOptional()
   @Type(()=>Date)
   @IsDate()
   last_done?: string
}