import { Column, Entity, BaseEntity, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Field, ObjectType, ID } from 'type-graphql';

import { Estate, EstatePrimaryType } from ".";

@ObjectType()
@Entity("estate_secondary_types", { schema: "public" })
export class EstateSecondaryType extends BaseEntity {

    @Field(() => ID)
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number

    @Field(() => String)
    @Column({ type: 'character varying', name: 'desc_cz' })
    desc_cz: string

    @Field(() => EstatePrimaryType)
    @ManyToOne(() => EstatePrimaryType, primary_type => primary_type.secondary_types, { lazy: true })
    @JoinColumn({ name: 'primary_type', referencedColumnName: 'id' })
    primary_type: EstatePrimaryType

    @Field(() => [Estate], { nullable: true })
    @OneToMany(() => Estate, estate => estate.secondary_type, { nullable: true, lazy: true })
    estates: Estate[]
}