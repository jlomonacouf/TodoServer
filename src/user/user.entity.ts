import { Table, Column, Model, AllowNull, NotEmpty, AutoIncrement, PrimaryKey, HasMany } from 'sequelize-typescript';
import { ProjectUser } from 'src/project/projectuser.entity';

@Table(
  {
    tableName: 'user',
    timestamps: false
  }
)
export class User extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  username!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  email!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  password!: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  date_created!: number;

  @Column
  avatar: string;

  @HasMany(() => ProjectUser)
  projectUsers: ProjectUser[];
}