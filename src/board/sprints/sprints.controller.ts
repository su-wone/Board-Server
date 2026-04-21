import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SprintsService } from './sprints.service.js';

@ApiTags('sprints')
@Controller('sprints')
export class SprintsController {
    constructor(private sprintsService: SprintsService) { }

    @ApiOperation({ summary: '스프린트 목록 조회' })
    @Get()
    findAll() {
        return this.sprintsService.findAll();
    }

    @ApiOperation({ summary: '스프린트 단건 조회' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.sprintsService.findOne(id);
    }
}