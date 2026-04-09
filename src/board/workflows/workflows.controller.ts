import { Controller, Get } from '@nestjs/common';
import { WorkflowsService } from './workflows.service.js';

@Controller('workflows')
export class WorkflowsController {
    constructor(private workflowsService: WorkflowsService) { }

    @Get()
    findAll() {
        return this.workflowsService.findAll();
    }
}