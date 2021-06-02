import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Country, Build } from ".";
  
@Entity('build_owner')
export default class BuildOwner {

    @PrimaryGeneratedColumn('uuid', { name: 'build_owner_id' })
    id: string;

    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @ManyToOne((type) => Build, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'build_id' })
    build: Build;
}