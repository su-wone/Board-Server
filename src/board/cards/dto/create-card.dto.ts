import { IsIn, IsInt, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export const CARD_TYPES = ['EPIC', 'STORY', 'TASK', 'SUB_TASK', 'BUG'] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const CARD_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type CardPriority = (typeof CARD_PRIORITIES)[number];

export class CreateCardDto {
    @IsString()
    @Length(1, 200)
    title!: string;

    @IsInt()
    workflowId!: number;

    @ValidateIf((_, value) => value !== null)
    @IsInt()
    sprintId!: number | null;

    @IsOptional()
    @IsIn(CARD_TYPES)
    type?: CardType;

    @IsOptional()
    @IsIn(CARD_PRIORITIES)
    priority?: CardPriority;
}
