import { Table, Column, Model, PrimaryKey, ForeignKey, AllowNull, NotEmpty, BelongsTo } from 'sequelize-typescript';
import { Project } from '../project/project.entity';

@Table(
  {
    tableName: 'workflow',
    timestamps: false
  }
)

export class Workflow extends Model {

  @PrimaryKey
  @ForeignKey(() => Project)
  @Column
  project_id?: number;

  @PrimaryKey
  @Column
  stage?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;

  @BelongsTo(() => Project)
  project: Project;
}