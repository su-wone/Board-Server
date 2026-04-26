import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CardsService } from './cards.service.js';
import { CardsFilterDto } from './dto/cards-filter.dto.js';
import { CreateCardDto } from './dto/create-card.dto.js';

const CARD_TYPE_VALUES = ['EPIC', 'STORY', 'TASK', 'SUB_TASK', 'BUG'] as const;
const CARD_PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH'] as const;

const userRefSchema = {
    type: 'object',
    nullable: true,
    properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: '강서원' },
    },
};

const labelSchema = {
    type: 'object',
    properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'frontend' },
        color: { type: 'string', example: '#22c55e' },
    },
};

const epicRefSchema = {
    type: 'object',
    nullable: true,
    properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: '온보딩 리뉴얼' },
        color: { type: 'string', example: '#6366f1' },
    },
};

const cardSummarySchema = {
    type: 'object',
    properties: {
        id: { type: 'number', example: 101 },
        title: { type: 'string', example: '로그인 버튼 정렬 수정' },
        type: { type: 'string', enum: [...CARD_TYPE_VALUES], example: 'TASK' },
        priority: { type: 'string', enum: [...CARD_PRIORITY_VALUES], example: 'MEDIUM' },
        workflowId: { type: 'number', example: 1 },
        sprintId: { type: 'number', nullable: true, example: 2 },
        description: { type: 'string', nullable: true, example: '상세 설명' },
        dueDate: { type: 'string', format: 'date-time', nullable: true },
        storyPoint: { type: 'number', nullable: true, example: 3 },
        order: { type: 'number', example: 1 },
        assignee: userRefSchema,
        reporter: userRefSchema,
        labels: { type: 'array', items: labelSchema },
        status: { type: 'string', example: 'TO DO' },
        epic: epicRefSchema,
        key: { type: 'string', example: 'VEASLY-101' },
    },
};

const cardDetailSchema = {
    type: 'object',
    properties: {
        ...cardSummarySchema.properties,
        parent: {
            type: 'object',
            nullable: true,
            properties: {
                id: { type: 'number', example: 50 },
                title: { type: 'string', example: '상위 스토리' },
                type: { type: 'string', enum: [...CARD_TYPE_VALUES], example: 'STORY' },
            },
        },
        children: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 120 },
                    title: { type: 'string', example: '하위 서브태스크' },
                    type: { type: 'string', enum: [...CARD_TYPE_VALUES], example: 'SUB_TASK' },
                },
            },
        },
    },
};

@ApiTags('cards')
@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) { }

    @ApiOperation({ summary: '카드 목록 조회 (필터 가능)' })
    @ApiOkResponse({
        description: '카드 목록',
        schema: { type: 'array', items: cardSummarySchema },
    })
    @Get()
    findAll(@Query() query: CardsFilterDto) {
        return this.cardsService.findAll(query);
    }

    @ApiOperation({ summary: '카드 단건 조회' })
    @ApiParam({ name: 'id', type: Number, example: 101 })
    @ApiOkResponse({ description: '카드 상세 (parent/children 포함)', schema: cardDetailSchema })
    @ApiNotFoundResponse({ description: '해당 id의 카드가 없음' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cardsService.findOne(id);
    }

    @ApiOperation({ summary: '카드 생성' })
    @ApiCreatedResponse({
        description: '생성된 카드 요약',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 101 },
                title: { type: 'string', example: '로그인 버튼 정렬 수정' },
                type: { type: 'string', enum: [...CARD_TYPE_VALUES], example: 'TASK' },
                priority: { type: 'string', enum: [...CARD_PRIORITY_VALUES], example: 'MEDIUM' },
                workflowId: { type: 'number', example: 1 },
                sprintId: { type: 'number', nullable: true, example: 2 },
                epicId: { type: 'number', nullable: true, example: 3 },
                key: { type: 'string', example: 'VEASLY-101' },
            },
        },
    })
    @ApiNotFoundResponse({ description: 'workflowId / sprintId / epicId 중 존재하지 않는 값이 있음' })
    @Post()
    create(@Body() dto: CreateCardDto) {
        return this.cardsService.create(dto);
    }
}
