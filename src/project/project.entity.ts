import { Table, Column, Model, AllowNull, NotEmpty, AutoIncrement, PrimaryKey, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { ProjectUser } from './projectuser.entity'

@Table(
  {
    tableName: 'project',
    timestamps: false
  }
)

export class Project extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  owner_id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  description!: string;

  @HasMany(() => ProjectUser)
  projectUsers: ProjectUser[];
}