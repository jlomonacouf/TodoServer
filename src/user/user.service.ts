import { Inject, Injectable } from "@nestjs/common";
import { User, User as UserEntity } from "./user.entity";

import { Op } from 'sequelize'

import * as bcrypt from 'bcrypt';
import { PROFILE_PROVIDER } from "../../constants";

@Injectable()
export class UserService {
    constructor(
        @Inject(PROFILE_PROVIDER)
        private profileRepository: typeof UserEntity
    ) {}

    async createProfile(username: string, 
                        password: string, 
                        email: string, 
                        first_name: string, 
                        last_name: string): Promise<any> {
        try {
            const existingUser: User = await User.findOne({
                where: {
                    [Op.or]: [
                        {username: username},
                        {email: email}
                    ]
                }
            })

            if(existingUser)
                return { success: false, message: 'Username or email is already in use.' };

            await bcrypt.hash(password, 10, async (err, hash) => {
                if(err) {
                    console.log(err);
                    return { success: false, message: 'An error occurred while creating the user' };
                }

                let user: User = await User.create({
                    username: username,
                    email: email,
                    password: hash,
                    first_name: first_name,
                    last_name: last_name,
                    date_created: Date.now(),
                    isVerified: 0
                });
    
                await user.save();
            });

            return { success: true, message: 'User succesfully created' };
        }
        catch(reason: any) {
            console.log(reason)
            if(reason.errors[0]) {
                if(reason.errors[0].path = 'username_UNIQUE')
                    return {success: false, message: 'Username is already in use' };
                else if(reason.errors[0].path = 'email_UNIQUE')
                    return { success: false, message: 'Email is already in use' };
            }

            return { success: false, message: 'Unable to create user' };
        }
    }

    async updateProfile(userid: number, password: string, email: string, firstName: string, lastName: string) {
        try {
            let user: User = await User.findOne({
                where: {
                    id: userid
                }
            });

            if(!user)
                return { success: false, message: 'Unable to locate user' };

            if(password) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                user.password = hash;
            }

            if(email) {
                const doesEmailExist: User = await User.findOne({
                    where: {
                        email: email
                    }
                });

                if(doesEmailExist)
                    return { success: false, message: 'Email is already in use' };

                user.email = email;
            }

            if(firstName)
                user.first_name = firstName;
            
            if(lastName)
                user.last_name = lastName;
            
            await user.save();

            return { success: true, message: 'Successfully updated profile' };
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to update profile' };
        }
    }

    async getUser(requestUsername, username: string): Promise<any> {
        try {
            let attributes = ['username', 'first_name', 'last_name', 'date_created'];

            if(requestUsername === username)
                attributes.push('email', 'isVerified');

            const user = await User.findOne({ 
                attributes: attributes,
                where: { 
                    username: username 
                } 
            });

            if(!user)
                return { success: false, message: 'Unable to find user' };
            
            return { success: true, message: 'User was found', data: user };
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to find user' };
        }
    }
}