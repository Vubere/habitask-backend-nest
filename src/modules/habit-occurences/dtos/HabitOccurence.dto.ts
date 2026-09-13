import { IsOptional, IsString } from "class-validator";


export class HabitOccurenceSummaryDto {
    @IsString()
    date: string;

    @IsString()
    habit_id: string;

    @IsString()
    user_id: string;

    @IsString()
    last_habbit_date: string;
}

export class CreateHabitOccurenceDto {
    @IsString()
    date: string;

    @IsString()
    habit_id: string;
    
    @IsString()
    user_id: string;
}

export class UpdateHabitOccurenceDto {
    @IsOptional()
    @IsString()
    date?: string;

    @IsOptional()
    @IsString()
    habit_id: string;
}