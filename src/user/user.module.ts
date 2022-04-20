import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { profileProvider } from './profile.provider'
import { fileProvider } from 'src/file_upload/file.provider'

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, ...profileProvider, ...fileProvider],
    exports: [UserService]
})
export class UserModule {};