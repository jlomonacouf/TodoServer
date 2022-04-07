import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';

import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('create_profile')
  createProfile(@Req() req,
                @Body('username') username: string,
                @Body('password') password: string,
                @Body('email') email: string,
                @Body('first_name') firstName: string,
                @Body('last_name') lastName: string): any {
    if(!username || !password || !email || !firstName || !lastName)
      return { success: false, message: 'Missing body parameters' };
    
    return this.userService.createProfile(username, password, email, firstName, lastName).then(res => {
      return res;
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('update')
  updateProfile(@Req() req,
                @Body('password') password: string,
                @Body('email') email: string,
                @Body('first_name') firstName: string,
                @Body('last_name') lastName: string): any {
    return this.userService.updateProfile(req.user.id, password, email, firstName, lastName).then(res => {
      return res;
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('view/:username')
  viewProfile(@Req() req, @Param() params): any {
    if(!params.username)
      return { success: false, message: 'Missing parameters' };

    return this.userService.getUser(req.user.username, params.username).then(res => {
      return res;
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req): any {
    if(req.user)
      return { success: true, message: "Successful login" }
    else
      return { success: false, message: "Invalid username or password" }
  }
}
