import { Sequelize } from 'sequelize-typescript';
import { User } from './user/user.entity';
import { Project } from './project/project.entity';
import { ProjectUser } from './project/projectuser.entity';
import { Workflow } from './workflow/workflow.entity';
import { Issue } from './issue/issue.entity';
import { DB_HOST, DB_PASS, DB_PORT, DB_SCHEMA, DB_USER } from 'environment';
import { SEQUELIZE_PROVIDER } from '../constants';

export const databaseProvider = [
    {
      provide: SEQUELIZE_PROVIDER,
      useFactory: async () => {
        const sequelize = new Sequelize({
          dialect: 'mysql',
          host: DB_HOST,
          port: DB_PORT,
          username: DB_USER,
          password: DB_PASS,
          database: DB_SCHEMA,
        });
        sequelize.addModels([User, Project, ProjectUser, Issue, Workflow]);
        await sequelize.sync();
        return sequelize;
      },
    },
  ];