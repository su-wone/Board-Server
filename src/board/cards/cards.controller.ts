import { Controller, Get, Query } from '@nestjs/common';
import { CardsService } from './cards.service.js';
import type { CardsFilter } from './cards.service.js';

@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) { }

    @Get()
    findAll(@Query() query: CardsFilter) {
        return this.cardsService.findAll(query);
    }
}