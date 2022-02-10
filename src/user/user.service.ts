import { Inject, Injectable } from "@nestjs/common";
import { User, User as UserEntity } from "./profile.entity";
import { CreateProfileDto } from "src/user/create-profile.dto";
import { Op } from 'sequelize'

@Injectable()
export class UserService {
    constructor(
        @Inject('PROFILE_REPOSITORY')
        private profileRepository: typeof UserEntity
    ) {}

    async createProfile(createProfileDto: CreateProfileDto) {
        try {
            User.findAll({
                where: {
                    [Op.or]: [
                        {username: createProfileDto.username},
                        {email: createProfileDto.email}
                    ]
                }
            })
            let user : User = await User.create({
                username: createProfileDto.username,
                email: createProfileDto.email,
                password: createProfileDto.password,
                salt: "0",
                first_name: createProfileDto.first_name,
                last_name: createProfileDto.last_name,
                date_created: Date.now(),
                isVerified: 0
            });

            user.save();
            
        }
        catch(reason: any) {
            if(reason.errors[0]) {
                if(reason.errors[0].path = 'username_UNIQUE')
                    return 'Username is already being used';
                else if(reason.errors[0].path = 'email_UNIQUE')
                    return 'Email is already being used';
            }

            return 'Unable to create user'
        }

        return 'User succesfully created';
    }
}