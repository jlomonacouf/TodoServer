import { ISSUE_PROVIDER } from '../../constants';
import { Issue } from './issue.entity'

export const issueProvider = [
  {
    provide: ISSUE_PROVIDER,
    useValue: Issue,
  },
];