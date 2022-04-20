import { Module } from '@nestjs/common';

import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { workflowProvider } from './workflow.provider'

@Module({
    imports: [],
    controllers: [WorkflowController],
    providers: [WorkflowService, ...workflowProvider],
    exports: []
})
export class WorkflowModule {};