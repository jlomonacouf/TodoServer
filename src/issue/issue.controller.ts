import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

import { IssueService } from './issue.service';

@Controller('issue')
@UseGuards(AuthenticatedGuard)
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Put('create')
  createIssue(@Req() req,
              @Body('owner') ownerUsername: string,
              @Body('project_title') projectTitle: string,
              @Body('title') issueTitle: string,
              @Body('description') description: string,
              @Body('status') status: string,
              @Body('type') issueType: string,
              @Body('urgency') urgency: number): any {
    if(!ownerUsername || !projectTitle || !issueTitle || !description || !status || !issueType || !urgency)
        return { success: false, message: 'Missing body parameters' };

    return this.issueService.createIssue(ownerUsername, projectTitle, req.user.id, issueTitle, description, status, issueType, urgency).then((res) => {
        return res;
    });
  }

  @Post('update')
  updateIssue(@Req() req,
              @Body('id') issueId: number,
              @Body('owner') ownerUsername: string,
              @Body('title') issueTitle: string,
              @Body('description') description: string,
              @Body('status') status: string,
              @Body('type') issueType: string,
              @Body('urgency') urgency: number): any {
        if(!issueId)
            return { success: false, message: 'Missing body parameters' };
        
        return this.issueService.updateIssue(issueId, ownerUsername, req.user.id, issueTitle, description, status, issueType, urgency).then((res) => {
            return res;
        });
    }

  @Get('all_project_issues/:username/:project_title')
  getAllProjectIssues(@Req() req, @Param() params): any {
    if(!params.username || !params.project_title)
        return { success: false, message: 'Missing parameters' };

    return this.issueService.getAllProjectIssues(req.user.id, params.username, params.project_title).then((res) => {
        return res;
    });
  }

  @Delete('delete/:id')
  deleteIssue(@Req() req, @Param() params): any {
    if(!params.id)
        return { success: false, message: 'Missing parameters' };

    return this,this.issueService.deleteIssue(req.user.id, params.id).then((res) => {
        return res;
    });
  }
}