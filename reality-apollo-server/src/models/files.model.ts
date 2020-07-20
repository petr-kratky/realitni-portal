import { Field, Int, ObjectType} from "type-graphql"
@ObjectType()
export class Files {
  @Field(type => String)
  url: string;

  @Field(() => String)
  key: string;
}
