import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
@Index("account_email_key", ["email"], { unique: true })
@Index("account_pkey", ["userId"], { unique: true })
@Index("account_username_key", ["username"], { unique: true })
@Entity("account", { schema: "reality" })
export class Account extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Field(() => String)
  @Column("character varying", { name: "username", unique: true, length: 50 })
  username: string;

  @Field(() => String)
  @Column("character varying", { name: "password", length: 100 })
  password: string;

  @Field(() => String)
  @Column("character varying", { name: "email", unique: true, length: 355 })
  email: string;

  @Field(() => Date, { nullable: true })
  @Column("timestamp without time zone", { name: "created_on" })
  createdOn: Date| null;;

  @Field(() => Date, { nullable: true })
  @Column("timestamp without time zone", { name: "last_login", nullable: true })
  lastLogin: Date | null;

  @Field(() => Int)
  @Column("integer", {
    name: "token_version",
    nullable: true,
    default: () => "0",
  })
  tokenVersion: number | null;
}
