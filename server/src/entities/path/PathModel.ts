import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ChildEntity, TableInheritance } from 'typeorm';
import { POI } from '..';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
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
  type: 'string';
  
}

@ChildEntity()
export class Walk extends Path {

  @Column('simple-json')
  latLngs: 'double'[][];

  @Column()
  distance: number;

  @Column()
  duration: number;

}

@ChildEntity()
export class Jeep extends Path {

  @Column('simple-json')
  latLngs: 'double'[][];

  @Column()
  distance: number;

  @Column()
  duration: number;

}

@ChildEntity()
export class Indoor extends Path {

  @Column('simple-json')
  instructions: string[];

}
