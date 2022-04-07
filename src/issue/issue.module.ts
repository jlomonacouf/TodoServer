import { Module } from '@nestjs/common';

import { IssueController } from './issue.controller';

import { IssueService } from './issue.service';

import { issueProvider } from './issue.provider';
import { databaseProvider } from '../database.provider';

@Module({
    imports: [],
    controllers: [IssueController],
    providers: [...issueProvider, ...databaseProvider, IssueService],
    exports: []
})
export class IssueModule {};