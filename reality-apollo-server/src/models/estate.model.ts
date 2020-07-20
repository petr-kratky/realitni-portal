import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Point } from 'geojson'
import { Source } from "./source.model";
import { Files } from './files.model'
import { ColumnNumericTransformer } from './transformers/column-numeric.transfomer'
import { Field, Int, ObjectType, ID, InputType } from 'type-graphql';

@ObjectType()
@Index("estate_geom_idx", ["geom"], {})
@Index("idx_20223_primary", ["id"], { unique: true })
@Entity("estate", { schema: "reality" })
export class Estate extends BaseEntity{
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Field(() => String, { nullable: true })
  @Column("date", {
    name: "reg_date",
    nullable: true,
    default: () => "CURRENT_DATE",
  })
  regDate: string | null;

  @Field(() => String, { nullable: true })
  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_function", nullable: true })
  advertFunction: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_type", nullable: true })
  advertType: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_subtype", nullable: true })
  advertSubtype: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "advert_price",
    nullable: true,
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  advertPrice: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_price_currency", nullable: true })
  advertPriceCurrency: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "price_note", nullable: true })
  priceNote: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_price_unit", nullable: true })
  advertPriceUnit: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "locality_latitude",
    nullable: true,
    precision: 20,
    scale: 10,
    transformer: new ColumnNumericTransformer()
  })
  localityLatitude: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "locality_longitude",
    nullable: true,
    precision: 20,
    scale: 10,
    transformer: new ColumnNumericTransformer()
  })
  localityLongitude: number | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "locality_street",
    nullable: true,
    length: 100,
  })
  localityStreet: string | null;
  @Field(() => String, { nullable: true })
  @Column("text", { name: "locality_co", nullable: true })
  localityCo: string | null;
  @Field(() => String, { nullable: true })
  @Column("text", { name: "locality_cp", nullable: true })
  localityCp: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "locality_city",
    nullable: true,
    length: 100,
  })
  localityCity: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "locality_citypart",
    nullable: true,
    length: 100,
  })
  localityCitypart: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "land_registry_area",
    nullable: true,
    length: 100,
  })
  landRegistryArea: string | null;



  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "energy_efficiency_rating", nullable: true })
  energyEfficiencyRating: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "energy_performance_certificate", nullable: true })
  energyPerformanceCertificate: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "advert_room_count", nullable: true })
  advertRoomCount: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "furnished", nullable: true })
  furnished: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "building_type", nullable: true })
  buildingType: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "building_condition", nullable: true })
  buildingCondition: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "object_type", nullable: true })
  objectType: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "object_kind", nullable: true })
  objectKind: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "object_location", nullable: true })
  objectLocation: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "ownership", nullable: true })
  ownership: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "surroundings_type", nullable: true })
  surroundingsType: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "building_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  buildingArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "usable_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  usableArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "floor_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  floorArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "garage", nullable: true })
  garage: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "garage_count", nullable: true })
  garageCount: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "store_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  storeArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "estate_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  estateArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "balcony", nullable: true })
  balcony: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "balcony_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  balconyArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "loggia", nullable: true })
  loggia: number | null;


  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "loggia_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  loggiaArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "terrace", nullable: true })
  terrace: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "terrace_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  terraceArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "cellar", nullable: true })
  cellar: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "cellar_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  cellarArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "offices_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  officesArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "shop_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  shopArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "garden_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  gardenArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "ceiling_height", nullable: true })
  ceilingHeight: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "floors", nullable: true })
  floors: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "reconstruction_year", nullable: true })
  reconstructionYear: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "object_age", nullable: true })
  objectAge: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "acceptance_year", nullable: true })
  acceptanceYear: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "parking_lots", nullable: true })
  parkingLots: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "parking", nullable: true })
  parking: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "garret", nullable: true })
  garret: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "elevator", nullable: true })
  elevator: number | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "title", nullable: true, length: 100 })
  title: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "name", nullable: true, length: 100 })
  name: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "surname", nullable: true, length: 100 })
  surname: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "electricity",
    nullable: true,
    length: 50,
  })
  electricity: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "water", nullable: true, length: 50 })
  water: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "transport",
    nullable: true,
    length: 50,
  })
  transport: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "telecommunication",
    nullable: true,
    length: 50,
  })
  telecommunication: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", {
    name: "road_type",
    nullable: true,
    length: 50,
  })
  roadType: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "heating", nullable: true, length: 50 })
  heating: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "gully", nullable: true, length: 50 })
  gully: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "gas", nullable: true, length: 50 })
  gas: string | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "floor_number", nullable: true })
  floorNumber: number | null;

  @Field(() => String, { nullable: true })
  @Column("geometry", { name: "geom", nullable: true })
  geom: Point | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "advert_usable_area",
    nullable: true,
    precision: 10,
    scale: 3,
    transformer: new ColumnNumericTransformer()
  })
  advertUsableArea: number | null;

  @Field(() => Number, { nullable: true })
  @Column("numeric", {
    name: "sell_price",
    nullable: true,
    precision: 20,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  sellPrice: number | null;

  @Field(() => String, { nullable: true })
  @Column("date", { name: "sell_date", nullable: true })
  sellDate: string | null;

  @Field(() => String, { nullable: true })
  @Column("date", { name: "advert_price_release_date", nullable: true })
  advertPriceReleaseDate: string | null;

  @Field(() => String, { nullable: true })
  @Column("character varying", { name: "external_id", nullable: true })
  externalId: string | null;

  @Field(() => String, { nullable: true })
  @Column("date", { name: "advert_date", nullable: true })
  advertDate: string | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "dph", nullable: true })
  dph: number | null;

  @Field(() => Number, { nullable: true })
  @Column("integer", { name: "commission", nullable: true })
  commission: number | null;

  @Field(() => String, { nullable: true })
  @Column("integer", { name: "share", nullable: true })
  share: string | null;

  @Field(type => Source)
  @ManyToOne(() => Source, (source) => source.estates)
  @JoinColumn([{ name: "source_id", referencedColumnName: "id" }])
  source: Source;

  @Field(() => String, { nullable: true })
  fullAddress: string | null

  @Field(() => [String], { nullable: true })
  s3Images: string[] | null

  @Field(() => [Files], { nullable: true })
  s3Files: Files[] | null
}