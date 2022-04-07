import { Inject, Injectable } from '@nestjs/common';

import { Issue } from './issue.entity';
import { User } from '../user/user.entity';
import { Project } from 'src/project/project.entity';
import { ProjectUser } from 'src/project/projectuser.entity';

import { Op, Sequelize } from 'sequelize'
import { ISSUE_PROVIDER, SEQUELIZE_PROVIDER } from '../../constants';

@Injectable()
export class IssueService {
    constructor(
        @Inject(ISSUE_PROVIDER)
        private issueRepository: typeof Issue,
        @Inject(SEQUELIZE_PROVIDER)
        private sequelize: Sequelize
    ) {}

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

    private async getProjectFromTitle(ownerUsername: string, projectTitle: string): Promise<Project> {
        try {
            const projectOwner: User = await User.findOne({
                where: {
                    username: ownerUsername
                }
            })
    
            if(!projectOwner)
                return null;
    
            const project: Project = await Project.findOne({
                where: {
                    owner_id: projectOwner.id,
                    name: projectTitle
                }
            })
    
            return project;
        }
        catch(reason: any) {
            return null;
        }
    }

    async createIssue(ownerUsername: string, projectTitle: string, userid: number, issueTitle: string, description: string, status: string, issueType: string, urgency: number): Promise<any> {
        try {
            const project = await this.getProjectFromTitle(ownerUsername, projectTitle);

            if(!project)
                return {success: false, message: 'Project does not exist' };

            if(await this.isUserApartOfProject(project.id, userid) === false)
                return { success: false, message: 'User is not a member of this project' };

            const issue = await Issue.create({
                project_id: project.id,
                user_id: userid,
                title: issueTitle,
                description: description,
                status: status,
                type: issueType,
                urgency: urgency,
                date_created: Date.now()
            });

            await issue.save();

            return { success: true, message: 'Issue was successfully created', data: issue.id }
        }
        catch {
            return { success: false, message: 'Unable to create issue' };
        }
    }

    async updateIssue(issueId: number, ownerUsername: string, userid: number, issueTitle: string, description: string, status: string, issueType: string, urgency: number) {
        try {
            let issue = await Issue.findOne({
                where: {
                    id: issueId
                }
            })

            if(!issue)
                return { success: false, message: 'Issue does not exist' };

            if(await this.isUserApartOfProject(issue.project_id, userid) === false)
                return { success: false, message: 'User is not a member of this project' };
            
            if(ownerUsername) {
                const newOwner = await User.findOne({where: {username: ownerUsername}})

                if(!newOwner)
                    return { success: false, message: 'User does not exist' };
                
                if(await this.isUserApartOfProject(issue.project_id, newOwner.id) === false)
                    return { success: false, message: 'Unable to assign issue to this user' };
                
                issue.user_id = newOwner.id;
            }

            if(issueTitle)
                issue.title = issueTitle;

            if(description)
                issue.description = description;
            
            if(status)
                issue.status = status;

            if(issueType)
                issue.type = issueType;

            if(urgency)
                issue.urgency = urgency;
            
            await issue.save();

            return { success: true, data: issue }
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to update issue' };
        }
    }

    async getAllProjectIssues(userid: number, ownerUsername: string, projectTitle: string): Promise<any> {
        try {
            const project = await this.getProjectFromTitle(ownerUsername, projectTitle);

            if(!project)
                return {success: false, message: 'Project does not exist' };

            if(await this.isUserApartOfProject(project.id, userid) === false)
                return { success: false, message: 'User is not a member of this project' };

            const allProjectIssues = await Issue.findAll({
                attributes: {exclude: ['user_id', 'project_id']},
                where: {
                    project_id: project.id
                }
            });

            return { success: true, data: allProjectIssues };
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to retrieve project issues' }
        }
    }

    async deleteIssue(userid: number, issueId: number): Promise<any> {
        try {
            const issue = await Issue.findOne({
                where: {
                    id: issueId
                }
            });

            if(await this.isUserApartOfProject(issue.project_id, userid) === false)
                return { success: false, message: 'Unable to delete issue' };

            await issue.destroy();

            return { success: true, message: 'Successfully deleted issue' }
        }
        catch(reason: any) {
            return { success: false, message: 'Unable to delete issue' };
        }
    }
}