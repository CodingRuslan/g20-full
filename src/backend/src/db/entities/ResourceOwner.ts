import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Country, Resource } from ".";

@Entity('resource_owner')
export default class ResourceOwner {

    @PrimaryGeneratedColumn('uuid', { name: 'resource_owner_id' })
    id: string;

    @Column({type: 'bigint'})
    count: number;


    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @ManyToOne((type) => Resource, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resource_id' })
    resource: Resource;
}