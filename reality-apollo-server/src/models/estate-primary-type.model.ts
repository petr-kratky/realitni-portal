import { Column, Entity, BaseEntity, PrimaryColumn, OneToMany } from "typeorm";
import { Field, ObjectType, ID } from 'type-graphql';

import { Estate } from ".";
import { EstateSecondaryType } from "./estate-secondary-type.model";

@ObjectType()
@Entity("estate_primary_types", { schema: "public" })
export class EstatePrimaryType extends BaseEntity {

    @Field(() => ID)
    @PrimaryColumn({ name: 'id' })
    id: number

    @Field(() => String)
    @Column({ type: 'character varying', name: 'desc_cz' })
    desc_cz: string

    @Field(() => [Estate])
    @OneToMany(() => Estate, estate => estate.primary_type)
    estates: Estate[]

    @Field(() => [EstateSecondaryType])
    @OneToMany(() => EstateSecondaryType, secondary_type => secondary_type.id)
    secondary_types: EstateSecondaryType[]
}