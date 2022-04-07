import { Table, Column, Model, PrimaryKey, ForeignKey, NotNull, HasOne, BelongsTo } from 'sequelize-typescript';
import { Project } from './project.entity';
import { User } from '../user/user.entity';

@Table(
  {
    tableName: 'project_user',
    timestamps: false
  }
)

export class ProjectUser extends Model {

  @PrimaryKey
  @ForeignKey(() => Project)
  @Column
  project_id?: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  user_id?: number;

  @BelongsTo(() => Project)
  projects: Project[];

  @BelongsTo(() => User)
  users: User[];
}