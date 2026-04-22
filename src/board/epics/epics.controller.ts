import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EpicsService } from './epics.service.js';

@ApiTags('epics')
@Controller('epics')
export class EpicsController {
    constructor(private epicsService: EpicsService) { }

    @ApiOperation({ summary: '에픽 목록 조회' })
    @Get()
    findAll() {
        return this.epicsService.findAll();
    }
}
