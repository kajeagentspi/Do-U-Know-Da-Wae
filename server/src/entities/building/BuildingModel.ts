import {
  Column,
  OneToMany,
  ChildEntity,
  PrimaryGeneratedColumn
} from "typeorm";
import { Room, POI } from "..";

@ChildEntity()
export class Building extends POI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buildingCode: String;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  alternativeNames: string;

  @Column("simple-json", { default: null })
  coordinates: number[][][];

  @OneToMany(type => Room, room => room.building, {
    onDelete: "CASCADE"
  })
  rooms: Room[];

  @Column({ type: "double", nullable: true })
  lat: number;

  @Column({ type: "double", nullable: true })
  lng: number;
}
