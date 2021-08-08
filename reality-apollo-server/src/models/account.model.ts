import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, Generated } from "typeorm";
import { Field, ObjectType, ID, Int, InputType } from 'type-graphql';

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
  @Column("timestamp with time zone", { name: "created_on", default: "now()" })
  createdOn: Date;

  @Field(() => Date, { nullable: true })
  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  lastLogin: Date;

  @Field(() => Int)
  @Column("integer", {
    name: "token_version",
    nullable: true,
    default: () => "0",
  })
  tokenVersion: number;
}

@InputType()
export class AccountUpdateInput implements Partial<Account> {

  @Field(() => String, { nullable: true })
  username?: string

  @Field(() => String, { nullable: true })
  email?: string

}