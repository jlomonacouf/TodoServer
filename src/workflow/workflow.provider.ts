import { WORKFLOW_PROVIDER } from '../../constants';
import { Workflow } from './workflow.entity';

export const workflowProvider = [
  {
    provide: WORKFLOW_PROVIDER,
    useValue: Workflow,
  },
];