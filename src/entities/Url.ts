import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  ObjectID,
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class Url extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: ObjectID;

  @Field()
  @Column()
  originalUrl: string;

  @Field()
  @Column({ type: "int", default: 0 })
  uses!: number;

  @Field()
  @Column()
  creatorId: ObjectID;

  @Field()
  @ManyToOne(() => User, (user) => user.links)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
