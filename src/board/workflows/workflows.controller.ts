import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service.js';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
    constructor(private workflowsService: WorkflowsService) { }

    @ApiOperation({ summary: '워크플로우 목록 조회' })
    @ApiOkResponse({
        description: '워크플로우 목록 (order 오름차순)',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    title: { type: 'string', example: 'To Do' },
                },
            },
        },
    })
    @Get()
    findAll() {
        return this.workflowsService.findAll();
    }
}
