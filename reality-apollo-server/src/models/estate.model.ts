import { Column, Entity, Index, BaseEntity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType, ID, Float, InputType } from 'type-graphql';
import { Point } from 'geojson'

@ObjectType()
@Entity("estates", { schema: "public" })
export class Estate extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Index({ spatial: true })
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: false })
  geom: Point;

  @Field(() => String)
  @Column("character varying", { name: "name", nullable: true, length: 128 })
  name: string;

  @Field(() => Float)
  @Column("numeric", {
    name: "longitude",
    nullable: true,
    precision: 20,
    scale: 10,
  })
  longitude: number;

  @Field(() => Float)
  @Column("numeric", {
    name: "latitude",
    nullable: true,
    precision: 20,
    scale: 10,
  })
  latitude: number;
}


@InputType()
export class EstateUpdateInput implements Partial<Estate> {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field(() => Float, { nullable: true })
  latitude?: number;
}


@InputType()
export class EstateCreateInput extends EstateUpdateInput {
  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  latitude: number;
}
