import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm"
import { Field, ObjectType, ID, Int, InputType } from "type-graphql"
import { Estate } from "."

@ObjectType()
@Entity("users", { schema: "public" })
export class Account extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Field(() => String)
  @Column("character varying", { name: "username", unique: true, length: 50 })
  username: string

  @Field(() => String)
  @Column("character varying", { name: "password", length: 100 })
  password: string

  @Field(() => String)
  @Column("character varying", { name: "email", unique: true, length: 355 })
  email: string

  @Field(() => Date)
  @Column("timestamp with time zone", { name: "created_on", default: "now()" })
  created_on: Date

  @Field(() => Date, { nullable: true })
  @Column("timestamp with time zone", { name: "last_login", nullable: true })
  last_login: Date

  @Field(() => Int)
  @Column("integer", {
    name: "token_version",
    nullable: true,
    default: () => "0"
  })
  tokenVersion: number

  @Field(() => [Estate], { nullable: true })
  @OneToMany(() => Estate, estate => estate.created_by, { nullable: true, lazy: true })
  created_estates: Estate[]

  @Field(() => [Estate], { nullable: true })
  @ManyToMany(() => Estate)
  @JoinTable({
    name: "user_recent_estates",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "estate_id", referencedColumnName: "id" }
  })
  recent_estates: Estate[]

  @Field(() => [Estate], { nullable: true })
  @ManyToMany(() => Estate)
  @JoinTable({
    name: "user_favorite_estates",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "estate_id", referencedColumnName: "id" }
  })
  favorite_estates: Estate[]
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken: string
  @Field(() => Account)
  account: Account
}

@ObjectType()
export class AccountPublicInfo implements Partial<Account> {
  @Field(() => ID)
  id: string

  @Field(() => String)
  username: string
}

@InputType()
export class AccountUpdateInput implements Partial<Account> {
  @Field(() => String, { nullable: true })
  username?: string

  @Field(() => String, { nullable: true })
  email?: string
}
