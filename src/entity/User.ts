import { Entity, ObjectIdColumn, Column, BaseEntity, ObjectID } from "typeorm";

@Entity("users")
export default class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  email: string;

  @Column()
  password: string;
}
