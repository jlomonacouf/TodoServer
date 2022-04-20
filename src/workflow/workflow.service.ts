import { Inject, Injectable } from "@nestjs/common";
import { Project } from "src/project/project.entity";
import internal from "stream";

import { WORKFLOW_PROVIDER } from "../../constants";
import { Workflow } from "./workflow.entity";

@Injectable()
export class WorkflowService {
    constructor(
        @Inject(WORKFLOW_PROVIDER)
        private workflowRepository: typeof Workflow
    ) {}

    async isStageOrNameAvailable(project_id: number, workflowName: string, stage: number) {
        try {
            const doesWorkFlowNameExist: Workflow = await Workflow.findOne({
                where: {
                    project_id: project_id,
                    name: workflowName
                }
            });

            if(doesWorkFlowNameExist)
                return { success: false, message: "Workflow with the same name already exists" };

            const doesWorkFlowStageExist: Workflow = await Workflow.findOne({
                where: {
                    project_id: project_id,
                    stage: stage
                }
            })

            if(doesWorkFlowStageExist)
                return { success: false, message: "Workflow with the same stage already exists" };
            
            return { success: true };
        }
        catch(reason: any) {
            return { success: false, message: "Workflow with the same stage already exists" };
        }
    }

    async addWorkflow(userid: number, projectName: string, workflowName: string, stage: number) {
        try {

            if(stage <= 0)
                return { success: false, message: "Unable to create workflow" };
                
            const project: Project = await Project.findOne({
                where: {
                    name: projectName,
                    owner_id: userid
                }
            });

            if(!project)
                return { success: false, message: "Project does not exist" };

            const isAvailable = await this.isStageOrNameAvailable(project.id, workflowName, stage);

            if(isAvailable.success === false)
                return isAvailable;
            
            let workflow: Workflow = await Workflow.create({
                project_id: project.id,
                stage: stage,
                name: workflowName
            });

            await workflow.save();

            return { success: true, message: "Successfully created workflow" };
        }
        catch(reason: any) {
            return { success: false, message: "Unable to create workflow" };
        }
    }
}
