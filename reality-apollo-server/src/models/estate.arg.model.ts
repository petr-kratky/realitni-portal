import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { Point } from 'geojson'
import { ColumnNumericTransformer } from './transformers/column-numeric.transfomer'
import { Field, ID, ArgsType, InputType } from 'type-graphql';
import { Estate } from './'

@InputType()
export class EstateInput implements Partial<Estate> {

@Field(() => ID)
id: number;
  
@Field(() => String, { nullable: true })
regDate: string | null;
@Field(() => String, { nullable: true })

description: string | null;
@Field(() => Number, { nullable: true })

advertFunction: number | null;
@Field(() => Number, { nullable: true })

advertType: number | null;
@Field(() => Number, { nullable: true })

advertSubtype: number | null;
@Field(() => Number, { nullable: true })

advertPrice: number | null;
@Field(() => Number, { nullable: true })
advertPriceCurrency: number | null;

@Field(() => Number, { nullable: true })
priceNote: number | null;

@Field(() => Number, { nullable: true })
advertPriceUnit: number | null;
@Field(() => Number, { nullable: true })
localityLatitude: number | null;
@Field(() => Number, { nullable: true })
localityLongitude: number | null;
@Field(() => String, { nullable: true })
localityStreet: string | null;
@Field(() => String, { nullable: true })

localityCo: string | null;
@Field(() => String, { nullable: true })

localityCp: string | null;
@Field(() => String, { nullable: true })
localityCity: string | null;

@Field(() => String, { nullable: true })
localityCitypart: string | null;

@Field(() => String, { nullable: true })
landRegistryArea: string | null;

@Field(() => Number, { nullable: true })

energyEfficiencyRating: number | null;
@Field(() => Number, { nullable: true })

energyPerformanceCertificate: number | null;
@Field(() => Number, { nullable: true })

advertRoomCount: number | null;
@Field(() => Number, { nullable: true })

furnished: number | null;
@Field(() => Number, { nullable: true })

buildingType: number | null;
@Field(() => Number, { nullable: true })

buildingCondition: number | null;
@Field(() => Number, { nullable: true })

objectType: number | null;
@Field(() => Number, { nullable: true })

objectKind: number | null;
@Field(() => Number, { nullable: true })

objectLocation: number | null;
@Field(() => Number, { nullable: true })

ownership: number | null;
@Field(() => Number, { nullable: true })

surroundingsType: number | null;
@Field(() => Number, { nullable: true })

buildingArea: number | null;
@Field(() => Number, { nullable: true })
usableArea: number | null;
@Field(() => Number, { nullable: true })

floorArea: number | null;
@Field(() => Number, { nullable: true })

garage: number | null;
@Field(() => Number, { nullable: true })

garageCount: number | null;
@Field(() => Number, { nullable: true })

storeArea: number | null;
@Field(() => Number, { nullable: true })

estateArea: number | null;
@Field(() => Number, { nullable: true })

balcony: number | null;
@Field(() => Number, { nullable: true })

balconyArea: number | null;
@Field(() => Number, { nullable: true })

loggia: number | null;
@Field(() => Number, { nullable: true })

loggiaArea: number | null;
@Field(() => Number, { nullable: true })

terrace: number | null;
@Field(() => Number, { nullable: true })

terraceArea: number | null;
@Field(() => Number, { nullable: true })

cellar: number | null;
@Field(() => Number, { nullable: true })

cellarArea: number | null;
@Field(() => Number, { nullable: true })

officesArea: number | null;
@Field(() => Number, { nullable: true })

shopArea: number | null;
@Field(() => Number, { nullable: true })

gardenArea: number | null;
@Field(() => Number, { nullable: true })

ceilingHeight: number | null;
@Field(() => Number, { nullable: true })

floors: number | null;
@Field(() => Number, { nullable: true })

reconstructionYear: number | null;
@Field(() => Number, { nullable: true })

objectAge: number | null;
@Field(() => Number, { nullable: true })

acceptanceYear: number | null;
@Field(() => Number, { nullable: true })

parkingLots: number | null;
@Field(() => Number, { nullable: true })

parking: number | null;
@Field(() => Number, { nullable: true })

garret: number | null;
@Field(() => Number, { nullable: true })

elevator: number | null;
@Field(() => String, { nullable: true })

title: string | null;

@Field(() => String, { nullable: true })
name: string | null;

@Field(() => String, { nullable: true })

surname: string | null;
@Field(() => String, { nullable: true })
electricity: string | null;
@Field(() => String, { nullable: true })

water: string | null;
@Field(() => String, { nullable: true })
transport: string | null;
@Field(() => String, { nullable: true })
telecommunication: string | null;
@Field(() => String, { nullable: true })
roadType: string | null;
@Field(() => String, { nullable: true })

heating: string | null;
@Field(() => String, { nullable: true })

gully: string | null;
@Field(() => String, { nullable: true })

gas: string | null;
@Field(() => Number, { nullable: true })
floorNumber: number | null;

@Field(() => Number, { nullable: true })
advertUsableArea: number | null;

@Field(() => Number, { nullable: true })
sellPrice: number | null;

@Field(() => String, { nullable: true })
sellDate: string | null;

@Field(() => String, { nullable: true })
advertPriceReleaseDate: string | null;

@Field(() => String, { nullable: true })
externalId: string | null;

@Field(() => String, { nullable: true })
advertDate: string | null;

@Field(() => Number, { nullable: true })
dph: number | null;

@Field(() => Number, { nullable: true })
commission: number | null;

@Field(() => String, { nullable: true })
share: string | null;
}
