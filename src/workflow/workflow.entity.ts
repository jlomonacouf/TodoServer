import { Table, Column, Model, PrimaryKey, ForeignKey, AllowNull, NotEmpty, BelongsTo, NotNull, AutoIncrement } from 'sequelize-typescript';
import { Project } from '../project/project.entity';

@Table(
  {
    tableName: 'workflow',
    timestamps: false
  }
)

export class Workflow extends Model {

  @PrimaryKey
  @AutoIncrement
  @Column
  id?: number;

  @Column
  project_id?: number;

  @Column
  stage?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;
}