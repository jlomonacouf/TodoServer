import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user: User = await User.findOne({ where: {username: username} })
            
            if(user && bcrypt.compareSync(password, user.password) === true) {
                const data: any = {
                    id : user.getDataValue("id"),       
                    username: user.getDataValue("username"),
                    email: user.getDataValue("email"),
                    firstName: user.getDataValue("first_name"),
                    lastName: user.getDataValue("last_name")
                };
    
                return data;
            }
    
            return null;
        }
        catch(reason: any) {
            console.log(reason);
            return null;
        }
    }
}
