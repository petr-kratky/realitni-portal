import { Column, Entity, Index, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check, BeforeInsert, BeforeUpdate } from "typeorm";
import { Field, ObjectType, ID, Float, InputType, Int } from 'type-graphql';
import { Point } from 'geojson'

import { EstatePrimaryType } from "./estate-primary-type.model";
import { EstateSecondaryType } from "./estate-secondary-type.model";
import { Account } from "./account.model";
import { AccountPublicInfo } from ".";

@ObjectType()
export class Image {
  @Field(() => String)
  _id: string

  @Field(() => String)
  original: string

  @Field(() => String)
  large: string

  @Field(() => String)
  mid: string

  @Field(() => String)
  small: string
}

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

  @Field(() => String)
  @Column("character varying", { length: 64 })
  street_address: string

  @Field(() => String)
  @Column("character varying", { length: 64 })
  city_address: string

  @Field(() => String)
  @Column("character", { length: 6 })
  postal_code: string

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  usable_area: number

  @Field(() => Int, { nullable: true })
  @Column("integer", { nullable: true })
  land_area: number

  @Field(() => EstatePrimaryType)
  @ManyToOne(() => EstatePrimaryType, primaryType => primaryType.estates, { nullable: false, lazy: true, eager: true })
  @JoinColumn({ name: 'primary_type', referencedColumnName: 'id' })
  primary_type: EstatePrimaryType

  @Field(() => EstateSecondaryType)
  @ManyToOne(() => EstateSecondaryType, secondaryType => secondaryType.estates, { nullable: false, lazy: true, eager: true })
  @JoinColumn({ name: 'secondary_type', referencedColumnName: 'id' })
  secondary_type: EstateSecondaryType

  @Field(() => AccountPublicInfo)
  @ManyToOne(() => Account, account => account.estates, { nullable: false, lazy: true, eager: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  created_by: Account

  @Field(() => [Image])
  images: Image[]
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

  @Field(() => String)
  street_address: string

  @Field(() => String)
  city_address: string

  @Field(() => String)
  postal_code: string

  @Field(() => Int)
  primary_type_id: number

  @Field(() => Int)
  secondary_type_id: number
}
