import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Country, Resource } from ".";
  
@Entity('increase_resource')
export default class IncreaseResources {

    @PrimaryGeneratedColumn('uuid', { name: 'increase_resource_id' })
    id: string;

    @Column({type: 'bigint', default: 0})
    count: number;

    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @ManyToOne((type) => Resource, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resource_id' })
    resource: Resource;
}