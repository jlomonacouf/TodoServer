import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Issue } from 'src/issue/issue.entity';
import { Project } from 'src/project/project.entity';
import { ProjectUser } from 'src/project/projectuser.entity';
import { User } from 'src/user/user.entity';

import { SEQUELIZE_PROVIDER, WORKFLOW_PROVIDER } from '../../constants';
import { Workflow } from './workflow.entity';

@Injectable()
export class WorkflowService {
    constructor(
        @Inject(WORKFLOW_PROVIDER)
        private workflowRepository: typeof Workflow,
        @Inject(SEQUELIZE_PROVIDER)
        private sequelize: Sequelize,
    ) {}

    private async isNameOrStageAvailable(project_id: number, workflowName: string, stage: number) {
        try {
            const doesWorkFlowNameExist: Workflow = await Workflow.findOne({
                where: {
                    project_id: project_id,
                    name: workflowName
                }
            });

            if(doesWorkFlowNameExist)
                return { success: false, message: 'Workflow with the same name already exists' };

            const finalStage: Workflow = await Workflow.findOne({
                where: {
                    project_id: project_id,
                    name: 'Completed'
                }
            });

            if(stage > finalStage.stage)
                return { success: false, message: 'Stage is out of bounds' };
            
            return { success: true };
        }
        catch(reason: any) {
            return { success: false, message: 'Workflow with the same stage already exists' };
        }
    }

    private async isUserApartOfProject(projectid: number, userid: number): Promise<boolean> {
        try{
            const projectUsers: ProjectUser[] = await ProjectUser.findAll({
                where: {
                    project_id: projectid
                }
            })
    
            for(const user of projectUsers) {
                if(user.user_id === userid) {
                    return true;
                }
            }
    
            return false;
        }
        catch(reason: any) {
            return false;
        }
    }

    async addWorkflow(userid: number, projectName: string, workflowName: string, stage: number) {
        try {
            if(stage <= 0)
                return { success: false, message: 'Unable to create workflow' };
                
            const project: Project = await Project.findOne({
                where: {
                    name: projectName,
                    owner_id: userid
                }
            });

            if(!project)
                return { success: false, message: 'Project does not exist' };

            const isAvailable = await this.isNameOrStageAvailable(project.id, workflowName, stage);

            if(isAvailable.success === false)
                return isAvailable;

            const t = await this.sequelize.transaction();

            await Workflow.update({stage: this.sequelize.literal('stage + 1')}, {
                where: {
                    project_id: project.id,
                    stage: {
                        [Op.gte]: stage
                    }
                }, transaction: t
            })

            let workflow: Workflow = await Workflow.create({
                project_id: project.id,
                stage: stage,
                name: workflowName
            }, { transaction: t });

            await t.commit();

            return { success: true, message: 'Successfully created workflow' };
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to create workflow' };
        }
    }

    async deleteWorkflow(userid: number, projectName: string, workflow: string) {
        try {
            if(workflow.toLowerCase() === 'not started' || workflow === 'completed')
                return { success: false, message: 'Unable to delete workflow' };
            
            const project: Project = await Project.findOne({
                where: {
                    owner_id: userid,
                    name: projectName
                }
            });

            if(!project)
                return { success: false, message: 'Project does not exist' };

            const issues: Issue = await Issue.findOne({
                where: {
                    status: workflow
                }
            });

            if(issues)
                return { success: false, message: 'Workflow must be cleared of any issues before deletion' };

            let deletionWorkflow: Workflow = await Workflow.findOne({
                where: {
                    project_id: project.id,
                    name: workflow
                }
            });

            const stage = deletionWorkflow.stage;

            if(!deletionWorkflow)
                return { success: false, message: 'Workflow does not exist' };

            const t = await this.sequelize.transaction();

            await deletionWorkflow.destroy({ transaction: t});
            
            await Workflow.update({stage: this.sequelize.literal('stage - 1')}, {
                where: {
                    project_id: project.id,
                    stage: {
                        [Op.gt]: stage
                    }
                }, transaction: t
            })
            
            await t.commit();

            return { success: true, message: 'Successfully removed workflow' }
        }
        catch(reason: any) {
            console.log(reason);
            return { success: false, message: 'Unable to delete workflow' };
        }
    }

    async getAllWorkflows(userid: number, ownerName: string, projectName: string) {
        try {
            const owner: User = await User.findOne({
                where: {
                    username: ownerName
                }
            });

            if(!owner)
                return { success: false, message: 'User does not exist' };

            const project: Project = await Project.findOne({
                where: {
                    owner_id: owner.id,
                    name: projectName
                }
            });

            if(!project)
                return { success: false, message: 'Project does not exist' };

            const isUserAMember: boolean = await this.isUserApartOfProject(project.id, userid);

            if(!isUserAMember)
                return { success: false, message: 'User is not a member of this project' };

            const workflows: Workflow[] = await Workflow.findAll({
                attributes: ['stage', 'name'],
                where: {
                    project_id: project.id
                }
            });

            return { success: true, data: workflows };
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to get all workflows' };
        }
    }
}
