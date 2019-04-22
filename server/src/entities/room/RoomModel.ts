import {
  Column,
  ManyToOne,
  ChildEntity,
  PrimaryGeneratedColumn
} from "typeorm";
import { Building, POI } from "..";

@ChildEntity()
export class Room extends POI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  level: Number;

  @ManyToOne(() => Building, building => building.rooms, {
    onDelete: "CASCADE"
  })
  building: Building;
}
