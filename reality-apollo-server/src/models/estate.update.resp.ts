import { Field, Int, ObjectType} from "type-graphql"

@ObjectType()
export class RespUpdate {
  @Field(() => Int)
  status: boolean;

  @Field(() => String)
  error: string | null;
}
