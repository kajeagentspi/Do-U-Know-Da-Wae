import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Room } from "..";

@Entity()
export class Building {
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

  @Column({ default: false })
  active: boolean;

  @OneToMany(type => Room, room => room.building, {
    onDelete: "CASCADE"
  })
  rooms: Room[];

  @Column({ type: "double", nullable: true })
  lat: number;

  @Column({ type: "double", nullable: true })
  lng: number;
}
