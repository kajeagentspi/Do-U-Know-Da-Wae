import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { POI } from '..';

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

  @Column()
  name: string;

  @Column({ default: 1 })
  level: Number;
  
}
