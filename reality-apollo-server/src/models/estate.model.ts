import { Column, Entity, Index, PrimaryColumn, BaseEntity } from "typeorm";
import { Point } from 'geojson'
import { Files } from './files.model'
import { Field, ObjectType, ID, Float } from 'type-graphql';

@ObjectType()
@Entity("estates", { schema: "public" })
export class Estate extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn({ type: "uuid", name: "id", generated: 'uuid' })
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
