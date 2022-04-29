import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

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
        return { success: false, message: 'Missing body parameters' };
      
      return this.workflowService.addWorkflow(req.user.id, projectName, workflowName, stage).then((res) => {
        return res;
      })
    }
  
  @Delete('delete/:project_name/:workflow')
  deleteWorkflow(@Req() req,
                 @Param() params): any {
    if(!params.workflow || !params.project_name)
      return { success: false, message: 'Missing parameters' };
    
    return this.workflowService.deleteWorkflow(req.user.id, params.project_name, params.workflow).then((res) => {
      return res;
    })
  }

  @Get('view/:owner_name/:project_name')
  getAllWorkflows(@Req() req,
                  @Param() params): any {
    if(!params.owner_name || !params.project_name)
      return { success: false, message: 'Missing parameters' };

    return this.workflowService.getAllWorkflows(req.user.id, params.owner_name, params.project_name).then((res) => {
      return res;
    })
  }
}