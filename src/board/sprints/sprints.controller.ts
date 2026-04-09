import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SprintsService } from './sprints.service.js';

@Controller('sprints')
export class SprintsController {
    constructor(private sprintsService: SprintsService) { }

    @Get()
    findAll() {
        return this.sprintsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.sprintsService.findOne(id);
    }
}