import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Country, Resource } from ".";
  
@Entity('resource_count_relations')
export default class ResourceCountRelations {

    @PrimaryGeneratedColumn('uuid', { name: 'resource_count_relations_id' })
    id: string;

    @Column({type: 'bigint', default: 0})
    count: number;

    @ManyToOne((type) => Resource, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resource_id' })
    resource: Resource;
}