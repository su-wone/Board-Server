import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CardsService } from './cards.service.js';
import type { CardsFilter } from './cards.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';

@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) { }

    @Get()
    findAll(@Query() query: CardsFilter) {
        return this.cardsService.findAll(query);
    }

    @Post()
    create(@Body() dto: CreateCardDto) {
        return this.cardsService.create(dto);
    }
}
