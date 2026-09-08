import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateHabitActionDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsString()
    habit_id: string;

    @Type(() => Number)
    @IsNumber()
    cost_incurred: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    is_positive: boolean | null;
}
