import { IsString } from "class-validator";


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