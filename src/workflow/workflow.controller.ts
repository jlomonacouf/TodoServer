import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

import { WorkflowService } from './workflow.service';

@Controller('workflow')
@UseGuards(AuthenticatedGuard)
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Put('create')
  createWorkflow(@Req() req,
                 @Body('project_name') projectName: string,
                 @Body('workflow_name') workflowName: string,
                 @Body('stage') stage: number): any {
        if(!projectName || !workflowName || !stage)
          return { success: false, message: "Missing body parameters" };
        
        return this.workflowService.addWorkflow(req.user.id, projectName, workflowName, stage).then((res) => {
          return res;
        })
    }

}