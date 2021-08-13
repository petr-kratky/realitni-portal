import { Column, Entity, BaseEntity, PrimaryColumn, OneToMany } from "typeorm";
import { Field, ObjectType, ID } from 'type-graphql';

import { Estate, EstateSecondaryType } from ".";

@ObjectType()
@Entity("estate_primary_types", { schema: "public" })
export class EstatePrimaryType extends BaseEntity {

    @Field(() => ID)
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number

    @Field(() => String)
    @Column({ type: 'character varying', name: 'desc_cz' })
    desc_cz: string

    @Field(() => [Estate], { nullable: true })
    @OneToMany(() => Estate, estate => estate.primary_type, { nullable: true, lazy: true })
    estates: Estate[]

    @Field(() => [EstateSecondaryType])
    @OneToMany(() => EstateSecondaryType, secondary_type => secondary_type.primary_type, { lazy: true })
    secondary_types: EstateSecondaryType[]
}