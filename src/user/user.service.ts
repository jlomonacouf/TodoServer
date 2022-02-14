import { Inject, Injectable } from "@nestjs/common";
import { User, User as UserEntity } from "./user.entity";
import { Op } from 'sequelize'

@Injectable()
export class UserService {
    constructor(
        @Inject('PROFILE_REPOSITORY')
        private profileRepository: typeof UserEntity
    ) {}

    async createProfile(username: string, 
                        password : string, 
                        email : string, 
                        first_name : string, 
                        last_name : string) {
        try {
            User.findAll({
                where: {
                    [Op.or]: [
                        {username: username},
                        {email: email}
                    ]
                }
            })
            let user : User = await User.create({
                username: username,
                email: email,
                password: password,
                salt: "0",
                first_name: first_name,
                last_name: last_name,
                date_created: Date.now(),
                isVerified: 0
            });

            user.save();
            
        }
        catch(reason: any) {
            if(reason.errors[0]) {
                if(reason.errors[0].path = 'username_UNIQUE')
                    return {sucess: false, message: 'Username is already being used'};
                else if(reason.errors[0].path = 'email_UNIQUE')
                    return {sucess: false, message: 'Email is already being used'};
            }

            return {sucess: false, message: 'Unable to create user'};
        }

        return {sucess: true, message: 'User succesfully created'};
    }

    async getUser(username : string) : Promise<any> {
        const user = await User.findOne({ where: { username: username } });

        return { username: user.username, first_name: user.first_name, last_name: user.last_name }
    }
}