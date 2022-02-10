import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateProfileDto } from './create-profile.dto';
import { UserService } from './user.service';
import { Profile } from './profile.interface'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getHello(): string {
    return "hello";
  }

  @Post('create_profile')
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.userService.createProfile(createProfileDto);
  }
}
