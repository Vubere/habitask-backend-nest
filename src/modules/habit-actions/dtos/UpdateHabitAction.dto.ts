import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateHabitActionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost_incurred?: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_positive?: boolean;
}
