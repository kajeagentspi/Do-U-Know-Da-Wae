import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { POI } from "..";

export enum PathType {
  WALKING = "walking",
  JEEP = "jeep",
  INDOOR = "indoor"
}

@Entity()
export class Path {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => POI, poi => poi.startPaths, {
    onDelete: "CASCADE"
  })
  origin: POI;

  @ManyToOne(type => POI, poi => poi.endPaths, {
    onDelete: "CASCADE"
  })
  destination: POI;

  @Column({ type: "simple-json", default: null })
  latLngs: "double"[][];

  @Column({ default: null })
  instructions: string;

  @Column({ type: "enum", enum: PathType })
  type: PathType;

  @Column({ default: 0 })
  distance: number;

  @Column({ default: 0 })
  duration: number;

  @Column()
  geometry: string;
}
