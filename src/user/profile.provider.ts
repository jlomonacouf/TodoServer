import { User } from './user.entity';

export const profileProvider = [
  {
    provide: 'PROFILE_REPOSITORY', //MOVE THIS TO CONSTANTS.TS FILE
    useValue: User,
  },
];