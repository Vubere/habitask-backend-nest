import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class HabitQueryDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    user_id: string;

    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsString()
    last_done_lte: string;

    @IsOptional()
    @IsString()
    last_done_gte: string;

    @IsOptional()
    @IsNumber()
    order_lte: number;

    @IsOptional()
    @IsNumber()
    order_gte: number;

    @IsOptional()
    @IsBoolean()
    is_positive: boolean;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    group_by: string;

    @IsOptional()
    @IsString()
    date_group: string;
}