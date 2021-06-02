import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity('country')
export default class Country {

    @PrimaryGeneratedColumn('uuid', { name: 'country_id' })
    id: string;

    @Column({type: 'varchar', unique: true})
    name: string;

    @Column({type: 'varchar', name: 'uniq_trade_key', unique: true})
    uniqTradeKey: string;

    @Column({type: 'varchar', nullable: true})
    img: string;

    @Column({type: 'int', default: 0, nullable: false})
    money: number;
}