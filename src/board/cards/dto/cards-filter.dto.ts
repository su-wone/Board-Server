import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class CardsFilterDto {
    @ApiPropertyOptional({
        description: '스프린트 필터 (백로그는 "null")',
        example: '2',
    })
    @IsOptional()
    @Matches(/^(null|\d+)$/, {
        message: 'sprintId는 숫자 또는 "null"이어야 합니다',
    })
    sprintId?: string;
}
