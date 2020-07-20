import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class File {
  @Field(type => String)
  filename!: string;

  @Field(type => String)
  mimetype!: string;

  @Field(type => String)
  encoding!: string;
}

@ObjectType()
class UploadResult {
  @Field(type => Boolean)
  uploaded!: boolean
}

export {
  File,
  UploadResult,
}
