import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class QueryHabitActionDto {
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
    @Type(() => Number)
    @IsNumber()
    cost_incurred_lte: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost_incurred_gte: number;

    @IsOptional()
    @Type(() => Number)
    @IsString()
    group_by: string;

    @IsOptional()
    @IsString()
    date_group: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    cost_incurred: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_positive: boolean | null;
}