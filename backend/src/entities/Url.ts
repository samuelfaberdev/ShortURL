import { IsUrl } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
@ObjectType()
export class Url extends BaseEntity {
  @PrimaryColumn()
  @Field()
  alias!: string;

  @Column()
  @Field()
  url!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @Column()
  @Field()
  expireAt!: Date;

  @ManyToOne(() => User, (user) => user.urls)
  @Field(() => User, { nullable: true })
  createdBy!: User;
}

@InputType()
export class UrlCreateInput {
  @Field()
  @IsUrl()
  url!: string;
}
