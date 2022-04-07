import { Inject, Injectable } from '@nestjs/common';
import { Project } from "./project.entity";
import { Op, Sequelize } from 'sequelize'
import { ProjectUser } from './projectuser.entity';
import { User } from 'src/user/user.entity';
import { Issue } from 'src/issue/issue.entity';
import { PROJECT_PROVIDER, SEQUELIZE_PROVIDER } from '../../constants';

@Injectable()
export class ProjectService {
    constructor(
        @Inject(PROJECT_PROVIDER)
        private projectRepository: typeof Project,
        @Inject(SEQUELIZE_PROVIDER)
        private sequelize: Sequelize
    ) {}

    private async isUserApartOfProject(projectid: number, userid: number): Promise<boolean> {
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

    async createProject(userid: number, name: string, description: string): Promise<any> {
        try
        {
            let projectWithSameName: Project = await Project.findOne({
                where: {
                    name: name
                }
            });

            if(projectWithSameName) {
                const projectUser: ProjectUser = await ProjectUser.findOne({ 
                    where: {
                        [Op.and]: [
                            { project_id: projectWithSameName.id },
                            { user_id: userid }
                        ]
                    }
                });
    
                if(projectUser)
                    return { success: false, message: 'Project with the same name already exists' };
            }
            
            await this.sequelize.transaction(async (t) => {
                const project : Project = await Project.create({
                    owner_id: userid,
                    name: name,
                    description: description
                }, {transaction: t});

                const projectUser: ProjectUser = await ProjectUser.create({
                    project_id: project.id,
                    user_id: userid
                }, {transaction: t});
            });

            return {success: true, message: 'Successfully created project'};
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to create project'};
        }
    }

    async getProject(userid: number, username: string, projectName: string): Promise<any> {
        try
        {
            const projectOwner: User = await User.findOne({
                where: {
                    username: username
                }
            })

            if(!projectOwner)
                return {success: false, message: 'User does not exist'};

            const project: Project = await Project.findOne({
                where: {
                    owner_id: projectOwner.id,
                    name: projectName
                }
            })

            if(!project)
                return {success: false, message: 'Project does not exist'};

            if(await this.isUserApartOfProject(project.id, userid) === true) {
                let data = { 
                    id: project.id, 
                    name: project.name, 
                    description: project.description 
                }

                return {success: true, data: data};
            }

            return {success: false, message: 'Project does not exist'};
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to find project'};
        }
    }

    async getProjectUsers(userid: number, username: string, projectName: string): Promise<any> {
        try {
            const projectOwner: User = await User.findOne({
                where: {
                    username: username
                }
            })
    
            if(!projectOwner)
                return {success: false, message: 'User does not exist'};
    
            const project: Project = await Project.findOne({
                where: {
                    owner_id: projectOwner.id,
                    name: projectName
                }
            })
    
            if(!project)
                return {success: false, message: 'Project does not exist'};
    
            if(await this.isUserApartOfProject(project.id, userid) === true) {
    
                const projectUsers: ProjectUser[] = await ProjectUser.findAll({
                    where: {project_id: project.id},
                    include: [{
                        model: User,
                        as: 'users',
                        attributes: ['username', 'first_name', 'last_name']
                    }],
                })
    
                let data = [];
    
                for(let user of projectUsers) {
                    data.push(user.users);
                }
    
                return {success: true, data: data}
            }

            return {success: false, message: 'User is not a member of this project'}
        }
        catch(reason: any) {
            return {success: false, message: 'Unable to retrieve members of this project'}
        }
    }

    async addUser(userid: number, projectName: string, username: string): Promise<any> {
        try
        {
            const project: Project = await Project.findOne({
                where: {
                    owner_id: userid,
                    name: projectName
                }
            });

            if(!project)
                return {success: false, message: 'Project does not exist'};

            const userToBeAdded: User = await User.findOne({
                where: {
                    username: username
                }
            });
    
            if(!userToBeAdded)
                return {success: false, message: 'User does not exist'};

            
            if(await this.isUserApartOfProject(project.id, userToBeAdded.id) === false) {
                const newProjectUser: ProjectUser = await ProjectUser.create({
                    project_id: project.id,
                    user_id: userToBeAdded.id
                });

                await newProjectUser.save();

                return {success: true, message: 'User was added to this project'};
            }
            else {
                return {success: false, message: 'User is already a member of this project'};
            }
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to add user to project'};
        }
    }

    async removeUser(userid: number, projectName: string, username: string): Promise<any> {
        try
        {
            const project: Project = await Project.findOne({
                where: {
                    owner_id: userid,
                    name: projectName
                }
            });

            if(!project)
                return {success: false, message: 'Project does not exist'};

                const userToBeRemoved: User = await User.findOne({
                where: {
                    username: username
                }
            });
    
            if(!userToBeRemoved)
                return {success: false, message: 'User does not exist'};

            
            if(await this.isUserApartOfProject(project.id, userToBeRemoved.id) === true) {
                let projectUser: ProjectUser = await ProjectUser.findOne({
                    where: {
                        project_id: project.id,
                        user_id: userToBeRemoved.id
                    }
                });

                await projectUser.destroy();
                
                return {success: true, message: 'User was removed from this project'};
            }
            else {
                return {success: false, message: 'User is not a member of this project'};
            }
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to add user to project'};
        }
    }

    async leaveProject(userid: number, projectName: string, ownerName: string) {
        try {
            const owner: User = await User.findOne({
                where: {
                    username: ownerName
                }
            });

            if(userid == owner.id)
                return {success: false, message: 'Unable to leave this project'};
    
            const project: Project = await Project.findOne({
                where: {
                    owner_id: owner.id,
                    name: projectName
                }
            });
    
            const projectUser: ProjectUser = await ProjectUser.findOne({
                where: {
                    project_id: project.id,
                    user_id: userid
                }
            })

            if(!projectUser)
                return {success: false, message: 'User is not a member of this project'};

            await projectUser.destroy();

            return {success: true, message: 'User has left this project'};
        }
        catch(reason: any) {
            return {success: false, message: 'Unable to leave this project'};
        }
    }

    async deleteProject(userid: number, name: string): Promise<any> {
        try
        {
            const project: Project = await Project.findOne({
                where: {
                    name: name
                }
            });

            if(project) {
                if(project.owner_id !== userid)
                    return {success: false, message: 'Unable to delete this project'};

                const projectUser: ProjectUser[] = await ProjectUser.findAll({ 
                    where: {
                        project_id: project.id
                    }
                });

                const issues: Issue[] = await Issue.findAll({
                    where: {
                        project_id: project.id
                    }
                });
    
                if(projectUser)
                {
                    await this.sequelize.transaction(async (t) => {
                        await Promise.all(projectUser.map((p) => { p.destroy() }));
                        await Promise.all(issues.map((i) => { i.destroy() }));
                        await project.destroy();
                    });
                    
                    return {success: true, message: 'Successfully deleted project'};
                }
            }
            
            return {success: false, message: 'Unable to find project for deletion'};
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to delete project', data: reason};
        }
    }

    async updateProject(userid: number, name: string, newName: string, description: string ): Promise<any> {
        try
        {
            let project : Project = await Project.findOne({
                where: {
                    [Op.and]: [
                        {user_id: userid},
                        {name: name}
                    ]
                }
            });

            if(!project)
                return {success: false, message: 'Unable to find project'};

            if(project.owner_id !== userid)
                return {success: false, message: 'Unable to update project'};

            if(newName)
                project.name = newName;

            if(description)
                project.description = description;

            await project.save();

            return {success: true, message: 'Successfully updated project'};
        }
        catch(reason: any)
        {
            return {success: false, message: 'Unable to update project'};
        }
    }
}
