import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'multerOptions';
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

    @Put('upload_photo/:project_name')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    updateAvatar(@Req() req,
                 @Param() params,
                 @UploadedFile() file: Express.Multer.File): any {
      if(!file || !params.project_name)
        return { success: false, message: 'Invalid image' };
  
      return this.projectService.uploadPhoto(req.user.id, params.project_name, file).then(res => {
        return res;
      })
    }

    @UseGuards(AuthenticatedGuard)
    @Get('images/:key')
    viewAvatar(@Req() req, @Res() res, @Param() params): any {
      if(!params.key)
        return { success: false, message: 'Missing parameters' };
  
      return this.projectService.getPhoto(res, params.key).then(res => {
        return res;
      });
    }
    
    @Get('view/:username/:project_name')
    getProject(@Req() req, @Param() params): any {
        if(!params.username || !params.project_name)
            return { success: false, message: 'Missing parameters' };
    
        return this.projectService.getProject(req.user.id, params.username, params.project_name).then((res) => {
            return res;
        });
    }

    @Get('get_users/:username/:project_name')
    getProjectUsers(@Req() req, @Param() params): any {
        if(!params.username || !params.project_name)
            return { success: false, message: 'Missing parameters' };

        return this.projectService.getProjectUsers(req.user.id, params.username, params.project_name).then((res) => {
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