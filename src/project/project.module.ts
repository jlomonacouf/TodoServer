import { Module } from '@nestjs/common';

import { ProjectController } from './project.controller';

import { ProjectService } from './project.service';

import { projectProvider } from './project.provider';
import { databaseProvider } from '../database.provider';

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [...projectProvider, ...databaseProvider, ProjectService],
    exports: []
})
export class ProjectModule {};