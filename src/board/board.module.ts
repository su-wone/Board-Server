import { Module } from '@nestjs/common';
import { WorkflowsModule } from './workflows/workflows.module.js';

@Module({
    imports: [WorkflowsModule],
})
export class BoardModule { }