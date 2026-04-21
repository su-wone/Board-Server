import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service.js';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
    constructor(private workflowsService: WorkflowsService) { }

    @ApiOperation({ summary: '워크플로우 목록 조회' })
    @Get()
    findAll() {
        return this.workflowsService.findAll();
    }
}