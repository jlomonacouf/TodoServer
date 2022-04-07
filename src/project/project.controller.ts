import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { ProjectService } from './project.service';

@Controller('project')
@UseGuards(AuthenticatedGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Put('create')
    createProject(@Req() req,
                  @Body('name') name: string,
                  @Body('description') description: string): any {
        if(!name || !description)
            return { success: false, message: 'Missing body parameters' };
    
        return this.projectService.createProject(req.user.id, name, description).then((res) => {
            return res;
        });
    }
    
    @Get('view/:username/:projectname')
    getProject(@Req() req, @Param() params): any {
        if(!params.username || !params.projectname)
            return { success: false, message: 'Missing parameters' };
    
        return this.projectService.getProject(req.user.id, params.username, params.projectname).then((res) => {
            return res;
        });
    }

    @Get('get_users/:username/:projectname')
    getProjectUsers(@Req() req, @Param() params): any {
        if(!params.username || !params.projectname)
            return { success: false, message: 'Missing parameters' };

        return this.projectService.getProjectUsers(req.user.id, params.username, params.projectname).then((res) => {
            return res;
        });
    }

    @Post('add_user')
    addUser(@Req() req,
            @Body('project_name') projectName: string,
            @Body('username') username: string): any {
        if(!projectName || !username)
            return { success: false, message: 'Missing body parameters' };
    
        return this.projectService.addUser(req.user.id, projectName, username).then((res) => {
            return res;
        });
    }

    @Post('remove_user')
    removeUser(@Req() req,
               @Body('project_name') projectName: string,
               @Body('username') username: string): any {
        if(!projectName || !username)
            return { success: false, message: 'Missing body parameters' };
    
        return this.projectService.removeUser(req.user.id, projectName, username).then((res) => {
            return res;
        });
    }

    @Post('leave_project')
    leaveProject(@Req() req,
                 @Body('project_name') projectName: string,
                 @Body('owner_name') ownerName: string): any {
        if(!projectName || !ownerName)
            return { success: false, message: 'Missing body parameters' };

        return this.projectService.leaveProject(req.user.id, projectName, ownerName).then((res) => {
            return res;
        });
    }

    @Delete('delete/:name')
    deleteProject(@Req() req, @Param() params): any {
        if(!params.name)
            return { success: false, message: 'Missing parameters' };

        return this.projectService.deleteProject(req.user.id, params.name).then((res) => {
            return res;
        })
    }

    @Post('update')
    updateProject(@Req() req,
                  @Body('name') name: string,
                  @Body('new_name') newName: string,
                  @Body('description') description: string): any {
        if(!name)
            return { success: false, message: 'Missing body parameters' };
            
        return this.projectService.updateProject(req.user.id, name, newName, description).then((res) => {
            return res;
        })
    }
}