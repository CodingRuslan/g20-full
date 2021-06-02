import {Entity, Column, PrimaryGeneratedColumn } from "typeorm";
  
@Entity('option')
export default class Options {

    @PrimaryGeneratedColumn('uuid', { name: 'option_id' })
    id: string;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'boolean'})
    value: boolean;
}