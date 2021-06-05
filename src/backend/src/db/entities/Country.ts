import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import {LifeLevel} from "./index";

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

    @Column({ type: 'timestamp', nullable: true })
    lifeLevelUpdate: Date;

    @ManyToOne((type) => LifeLevel, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'life_level_id' })
    lifeLevel: LifeLevel;
}
