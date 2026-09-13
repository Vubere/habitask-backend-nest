import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class HabitUpdateDto {
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
   @IsString()
   pros: string;

   @IsOptional()
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