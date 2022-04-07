import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { IssueModule } from './issue/issue.module'

import { databaseProvider } from './database.provider';


@Module({
  imports: [UserModule, AuthModule, ProjectModule, IssueModule],
  controllers: [],
  providers: [...databaseProvider],
})
export class AppModule {}
