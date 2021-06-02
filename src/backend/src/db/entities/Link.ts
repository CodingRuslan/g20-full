import {Entity, Column, PrimaryGeneratedColumn } from "typeorm";
  
@Entity('link')
export default class Link {

    @PrimaryGeneratedColumn('uuid', { name: 'option_id' })
    id: string;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'varchar'})
    link: string;
}