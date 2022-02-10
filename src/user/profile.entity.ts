import { Table, Column, Model, AllowNull, NotEmpty, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table(
  {
    tableName: "user",
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
  email!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  password!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  salt!: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  date_created!: number;

  @Column
  isVerified: number;
}