import { Column, Entity, BaseEntity, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, ID } from 'type-graphql';

import { Estate } from ".";
import { EstatePrimaryType } from "./estate-primary-type.model";

@ObjectType()
@Entity("estate_secondary_types", { schema: "public" })
export class EstateSecondaryType extends BaseEntity {

    @Field(() => ID)
    @PrimaryColumn({ name: 'id' })
    id: number

    @Field(() => String)
    @Column({ type: 'character varying', name: 'desc_cz' })
    desc_cz: string

    @Field(() => EstatePrimaryType)
    @ManyToOne(() => EstatePrimaryType, primary_type => primary_type.id)
    @JoinColumn({ name: 'primary_type', referencedColumnName: 'id' })
    primary_type: EstatePrimaryType

    @Field(() => [Estate])
    @OneToMany(() => Estate, estate => estate.secondary_type)
    estates: Estate[]
}