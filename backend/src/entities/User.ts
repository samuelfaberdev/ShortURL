import { IsEmail, Matches } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({
    length: 150,
    unique: true,
  })
  @Field()
  @IsEmail()
  email!: string;

  @Column()
  @Field()
  hashedPassword!: string;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @Column("boolean", { default: false })
  @Field()
  isAdmin!: boolean;
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^.{8,50}$/, {
    message: "Password length",
  })
  password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  newPassword: string;
}
