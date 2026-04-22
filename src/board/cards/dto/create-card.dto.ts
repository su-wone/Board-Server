import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Length, ValidateIf } from 'class-validator';
import { CardType } from '../../../../generated/prisma/client.js';

export const CARD_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type CardPriority = (typeof CARD_PRIORITIES)[number];

export class CreateCardDto {
    @ApiProperty({ description: '카드 제목', minLength: 1, maxLength: 200, example: '로그인 버튼 정렬 수정' })
    @IsString()
    @Length(1, 200)
    title!: string;

    @ApiProperty({ description: '워크플로우 id', example: 1 })
    @IsInt()
    workflowId!: number;

    @ApiProperty({
        description: '스프린트 id (백로그면 null)',
        example: 2,
        nullable: true,
        type: Number,
    })
    @ValidateIf((_, value) => value !== null)
    @IsInt()
    sprintId!: number | null;

    @ApiPropertyOptional({
        description: '카드 타입',
        enum: CardType,
        example: CardType.TASK,
    })
    @IsOptional()
    @IsEnum(CardType)
    type?: CardType;

    @ApiPropertyOptional({
        description: '우선순위 (기본 MEDIUM)',
        enum: CARD_PRIORITIES,
        example: 'MEDIUM',
    })
    @IsOptional()
    @IsIn(CARD_PRIORITIES)
    priority?: CardPriority;

    @ApiPropertyOptional({ description: '에픽 id', example: 3 })
    @IsOptional()
    @IsInt()
    epicId?: number;
}
