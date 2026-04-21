import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service.js';
import { CardsFilterDto } from './dto/cards-filter.dto.js';
import { CreateCardDto } from './dto/create-card.dto.js';

@ApiTags('cards')
@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) { }

    @ApiOperation({ summary: '카드 목록 조회 (필터 가능)' })
    @Get()
    findAll(@Query() query: CardsFilterDto) {
        return this.cardsService.findAll(query);
    }

    @ApiOperation({ summary: '카드 생성' })
    @Post()
    create(@Body() dto: CreateCardDto) {
        return this.cardsService.create(dto);
    }
}
