import { Column, Entity, Index, OneToMany } from "typeorm";
import { Field, Int, ObjectType} from "type-graphql"
import { Estate } from "./estate.model";
@ObjectType()
@Index("source_pkey", ["id"], { unique: true })
@Entity("source", { schema: "reality" })
export class Source {
  @Field(type => Int)
  @Column("integer", { primary: true, name: "id" })
  id: number;

  @Field(() => String)
  @Column("character varying", { name: "source", nullable: true, length: 50 })
  source: string | null;

  @Field(type => [Estate])
  @OneToMany(() => Estate, (estate) => estate.source)
  estates: Estate[];
}
