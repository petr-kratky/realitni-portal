import { Column, Entity, Index, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, BeforeInsert, BeforeUpdate } from "typeorm";
import { Field, ObjectType, ID, Float, InputType, Int } from 'type-graphql';
import { Point } from 'geojson'

import { EstatePrimaryType } from "./estate-primary-type.model";
import { EstateSecondaryType } from "./estate-secondary-type.model";
import { ApolloError } from "apollo-server-express";
import { Account } from "./account.model";
import { AccountPublicInfo } from ".";

@ObjectType()
@Entity("estates", { schema: "public" })
@Check(`"secondary_type" IS NULL OR "primary_type" IS NOT NULL`)
@Check(`"advert_price" >= 0`)
@Check(`"estimated_price" >= 0`)
@Check(`"usable_area" >= 0`)
@Check(`"land_area" >= 0`)
export class Estate extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Index({ spatial: true })
  @Column({ type: "geometry", spatialFeatureType: "Point", srid: 4326, nullable: false })
  geom: Point;

  @Field(() => String, { nullable: true })
  @Column("character varying", { nullable: true, length: 128 })
  name: string;

  @Field(() => String, { nullable: true })
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

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  advert_price: number;

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  estimated_price: number;

  @Field(() => String, { nullable: true })
  @Column("character varying", { nullable: true, length: 64 })
  street_address: string

  @Field(() => String, { nullable: true })
  @Column("character varying", { nullable: true, length: 64 })
  city_address: string

  @Field(() => String, { nullable: true })
  @Column("character", { nullable: true, length: 5 })
  postal_code: string

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  usable_area: number

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  land_area: number

  @Field(() => EstatePrimaryType, { nullable: true })
  @ManyToOne(() => EstatePrimaryType, primaryType => primaryType.estates, { nullable: true, lazy: true, eager: true })
  @JoinColumn({ name: 'primary_type', referencedColumnName: 'id' })
  primary_type: EstatePrimaryType

  @Field(() => EstateSecondaryType, { nullable: true })
  @ManyToOne(() => EstateSecondaryType, secondaryType => secondaryType.estates, { nullable: true, lazy: true, eager: true })
  @JoinColumn({ name: 'secondary_type', referencedColumnName: 'id' })
  secondary_type: EstateSecondaryType

  @Field(() => AccountPublicInfo, { nullable: false })
  @ManyToOne(() => Account, account => account.estates, { nullable: false, lazy: true, eager: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  created_by: Account
}

@InputType()
export class EstateUpdateInput implements Partial<Estate> {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  longitude?: number

  @Field(() => Float, { nullable: true })
  latitude?: number

  @Field(() => Int, { nullable: true })
  advert_price: number;

  @Field(() => Int, { nullable: true })
  estimated_price: number;

  @Field(() => String, { nullable: true })
  street_address: string

  @Field(() => String, { nullable: true })
  city_address: string

  @Field(() => String, { nullable: true })
  postal_code: string

  @Field(() => Int, { nullable: true })
  usable_area: number

  @Field(() => Int, { nullable: true })
  land_area: number

  @Field(() => Int, { nullable: true })
  primary_type_id: number

  @Field(() => Int, { nullable: true })
  secondary_type_id: number

}


@InputType()
export class EstateCreateInput extends EstateUpdateInput {
  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  latitude: number;
}
