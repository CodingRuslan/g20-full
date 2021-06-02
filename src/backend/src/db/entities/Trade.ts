import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { Country, Resource } from ".";

export enum TradeStatus {
    Active = 'active',
    Closed = 'closed',
  }
  
@Entity('trade')
export class Trade {

    @PrimaryGeneratedColumn('uuid', { name: 'trade_id' })
    id: string;

    @Column({type: 'timestamptz'})
    time: Date;

    @Column({type: 'int'})
    count: number;

    @Column({type: 'real'})
    cost: number;

    @Column({type: 'real'})
    sum: number;

    @Column({
        type: 'enum',
        enum: TradeStatus,
        default: TradeStatus.Active,
    })
    status: TradeStatus;

    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    owner: Country;

    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'seller_id' })
    seller: Country;

    @ManyToOne((type) => Country, { cascade: true, onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'buyer_id' })
    buyer: Country;

    @ManyToOne((type) => Resource, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'resource_id' })
    resource: Resource;
}