import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
@Entity("users", { schema: "public" })
export class Account extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("character varying", { name: "username", unique: true, length: 50 })
  username: string;

  @Field(() => String)
  @Column("character varying", { name: "password", length: 100 })
  password: string;

  @Field(() => String)
  @Column("character varying", { name: "email", unique: true, length: 355 })
  email: string;

  @Field(() => Date)
  @Column("timestamp without time zone", { name: "created_on", nullable: true })
  createdOn: Date;

  @Field(() => Date, { nullable: true })
  @Column("timestamp without time zone", { name: "last_login", nullable: true })
  lastLogin: Date;

  @Field(() => Int)
  @Column("integer", {
    name: "token_version",
    nullable: true,
    default: () => "0",
  })
  tokenVersion: number;
}