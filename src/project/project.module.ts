import { Module } from '@nestjs/common';

import { ProjectController } from './project.controller';

import { ProjectService } from './project.service';

import { projectProvider } from './project.provider';
import { databaseProvider } from '../database.provider';
import { fileProvider } from '../file_upload/file.provider';

@Module({
    imports: [],
    controllers: [ProjectController],
    providers: [...projectProvider, ...databaseProvider, ...fileProvider, ProjectService],
    exports: []
})
export class ProjectModule {};