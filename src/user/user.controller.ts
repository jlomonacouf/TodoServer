import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('view/:username')
  getHello(@Param() params) : any {
    return this.userService.getUser(params.username).then(res => {
      return res;
    });
  }

  @Post('create_profile')
  createProfile(@Body('username') username : string,
                      @Body('password') password : string,
                      @Body('email') email : string,
                      @Body('first_name') first_name : string,
                      @Body('last_name') last_name : string) {
    return this.userService.createProfile(username, password, email, first_name, last_name).then(res => {
      return res;
    });
  }
}
