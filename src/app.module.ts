import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { profileProvider } from './user/profile.provider'

import { AppService } from './app.service';
import { databaseProvider } from './database.provider';

@Module({
  imports: [],
  controllers: [AppController,
                UserController],
  providers: [AppService,
              UserService,
              ...profileProvider,
              ...databaseProvider],
})
export class AppModule {}
