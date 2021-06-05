import {Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { ResourceCountRelations } from ".";

@Entity('life_level')
export default class LifeLevel {

  @PrimaryGeneratedColumn('uuid', { name: 'life_level_id' })
  id: string;

  @Column({type: 'int', default: 1})
  number: number;

  @Column({type: 'varchar', unique: true})
  name: string;

  @Column({type: 'varchar'})
  condition: string;

}
