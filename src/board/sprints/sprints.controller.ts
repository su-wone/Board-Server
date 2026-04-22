import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { SprintsService } from './sprints.service.js';

const SPRINT_STATUS_VALUES = ['PLANNED', 'IN_PROGRESS', 'DONE'] as const;

const sprintSchema = {
    type: 'object',
    properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Sprint 1' },
        status: { type: 'string', enum: [...SPRINT_STATUS_VALUES], example: 'IN_PROGRESS' },
        startDate: { type: 'string', format: 'date-time', nullable: true },
        endDate: { type: 'string', format: 'date-time', nullable: true },
        cardCount: { type: 'number', example: 12 },
    },
};

@ApiTags('sprints')
@Controller('sprints')
export class SprintsController {
    constructor(private sprintsService: SprintsService) { }

    @ApiOperation({ summary: '스프린트 목록 조회' })
    @ApiOkResponse({
        description: '스프린트 목록 (각 스프린트의 카드 수 포함)',
        schema: { type: 'array', items: sprintSchema },
    })
    @Get()
    findAll() {
        return this.sprintsService.findAll();
    }

    @ApiOperation({ summary: '스프린트 단건 조회' })
    @ApiParam({ name: 'id', type: Number, example: 1 })
    @ApiOkResponse({ description: '스프린트 상세', schema: sprintSchema })
    @ApiNotFoundResponse({ description: '해당 id의 스프린트가 없음' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.sprintsService.findOne(id);
    }
}
