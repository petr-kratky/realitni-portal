import { Column, Entity, Index, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn } from "typeorm";
import { Field, ObjectType, ID, Float, InputType, Int } from 'type-graphql';
import { Point } from 'geojson'

import { EstatePrimaryType } from "./estate-primary-type.model";
import { EstateSecondaryType } from "./estate-secondary-type.model";

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
  @Column("character varying", { nullable: true, length: 128 })
  name: string;

  @Field(() => String)
  @Column("character varying", { nullable: true, length: 4096 })
  description: string;

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

  @Field(() => Int)
  @Column("integer", { nullable: true })
  advert_price: number;

  @Field(() => Int)
  @Column("integer", { nullable: true })
  estimated_price: number;

  @Field(() => String)
  @Column("character varying", { nullable: true, length: 64 })
  street_address: string

  @Field(() => String)
  @Column("character varying", { nullable: true, length: 64 })
  city_address: string

  @Field(() => String)
  @Column("character", { nullable: true, length: 5 })
  postal_code: string

  @Field(() => Int)
  @Column("integer", { nullable: true })
  usable_area: number

  @Field(() => Int)
  @Column("integer", { nullable: true })
  land_area: number

  @Field(() => EstatePrimaryType)
  @ManyToOne(() => EstatePrimaryType, type => type.id)
  @JoinColumn({ name: 'primary_type', referencedColumnName: 'id' })
  primary_type: EstatePrimaryType

  @Field(() => EstateSecondaryType)
  @ManyToOne(() => EstateSecondaryType, type => type.id)
  @JoinColumn({ name: 'secondary_type', referencedColumnName: 'id' })
  secondary_type: EstateSecondaryType
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
