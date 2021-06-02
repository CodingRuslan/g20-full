import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { ResourceCountRelations } from ".";
  
@Entity('build')
export default class Build {

    @PrimaryGeneratedColumn('uuid', { name: 'build_id' })
    id: string;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'varchar'})
    icon: string;

    @Column({type: 'bigint', default: 0})
    moneyCost: number;

    @ManyToMany((type) => ResourceCountRelations, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'change_id' })
    @JoinTable()
    changes: ResourceCountRelations[];

    @ManyToMany((type) => ResourceCountRelations, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'build_conditions_id' })
    @JoinTable()
    buildConditions: ResourceCountRelations[];
}