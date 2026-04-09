import { Module } from '@nestjs/common';
import { WorkflowsModule } from './workflows/workflows.module.js';
import { SprintsModule } from './sprints/sprints.module.js';

@Module({
    imports: [WorkflowsModule, SprintsModule],
})
export class BoardModule { }