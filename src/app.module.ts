import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { IssueModule } from './issue/issue.module'
import { WorkflowModule } from './workflow/workflow.module';

import { databaseProvider } from './database.provider';
import { fileProvider } from './file_upload/file.provider'


@Module({
  imports: [UserModule, AuthModule, ProjectModule, IssueModule, WorkflowModule],
  controllers: [],
  providers: [...databaseProvider, ...fileProvider],
})
export class AppModule {}
