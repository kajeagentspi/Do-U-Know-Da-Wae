import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Building } from '..';

@Entity()
export class Room {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  level: Number;

  @ManyToOne(type => Building, building => building.rooms, {
    onDelete: "CASCADE"
  })
  building: Building;
}
