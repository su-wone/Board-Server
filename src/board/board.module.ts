import { Module } from '@nestjs/common';
import { WorkflowsModule } from './workflows/workflows.module.js';
import { SprintsModule } from './sprints/sprints.module.js';
import { CardsModule } from './cards/cards.module.js';
import { EpicsModule } from './epics/epics.module.js';

@Module({
    imports: [WorkflowsModule, SprintsModule, CardsModule, EpicsModule],
})
export class BoardModule { }