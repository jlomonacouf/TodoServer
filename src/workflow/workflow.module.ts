import { Module } from '@nestjs/common';

import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { workflowProvider } from './workflow.provider'
import { databaseProvider } from 'src/database.provider';

@Module({
    imports: [],
    controllers: [WorkflowController],
    providers: [WorkflowService, ...workflowProvider, ...databaseProvider],
    exports: []
})
export class WorkflowModule {};