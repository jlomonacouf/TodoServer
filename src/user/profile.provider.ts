import { PROFILE_PROVIDER } from '../../constants';
import { User } from './user.entity';

export const profileProvider = [
  {
    provide: PROFILE_PROVIDER,
    useValue: User,
  },
];