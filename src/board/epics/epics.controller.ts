import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EpicsService } from './epics.service.js';

@ApiTags('epics')
@Controller('epics')
export class EpicsController {
    constructor(private epicsService: EpicsService) { }

    @ApiOperation({ summary: '에픽 목록 조회' })
    @ApiOkResponse({
        description: '에픽 목록',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: '온보딩 리뉴얼' },
                    color: { type: 'string', example: '#6366f1' },
                },
            },
        },
    })
    @Get()
    findAll() {
        return this.epicsService.findAll();
    }
}
