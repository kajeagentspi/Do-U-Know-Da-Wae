import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { POI } from '..';

export enum PathType {
  JEEP = 'jeep',
  WALK = 'walk',
}

@Entity()
export class Path {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => POI, poi => poi.startPaths, {
    onDelete: 'CASCADE'
  })
  start: POI;

  @ManyToOne(type => POI, poi => poi.endPaths, {
    onDelete: 'CASCADE'
  })
  end: POI;

  @Column({ type: 'enum', enum: PathType })
  type: PathType;

  @Column('simple-json')
  latLngs: number[][];
  
}
