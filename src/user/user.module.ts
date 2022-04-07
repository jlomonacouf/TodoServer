import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { profileProvider } from './profile.provider'

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, ...profileProvider],
    exports: [UserService]
})
export class UserModule {};