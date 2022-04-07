import { PROJECT_PROVIDER } from '../../constants';
import { Project } from './project.entity'

export const projectProvider = [
  {
    provide: PROJECT_PROVIDER,
    useValue: Project,
  },
];