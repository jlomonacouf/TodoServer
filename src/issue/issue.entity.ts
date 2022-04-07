import { Table, Column, Model, AllowNull, NotEmpty, AutoIncrement, PrimaryKey, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Table(
  {
    tableName: 'issue',
    timestamps: false
  }
)

export class Issue extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @ForeignKey(() => Project)
  @Column
  project_id?: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string;

  @AllowNull(true)
  @Column
  description!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  status!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  type!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  urgency!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  date_created!: number;

  @BelongsTo(() => Project)
  project: Project;

  @BelongsTo(() => User)
  user: User;
}