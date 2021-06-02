import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity('resource')
export default class Resource {

    @PrimaryGeneratedColumn('uuid', { name: 'resource_id' })
    id: string;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'boolean'})
    isTradable: boolean;
}