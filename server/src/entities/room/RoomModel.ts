import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Building, POI } from '..';

@ChildEntity()
export class Room extends POI {

  @Column()
  name: string;

  @Column({ default: 1 })
  level: Number;

  @ManyToOne(type => Building, building => building.rooms, {
    onDelete: 'CASCADE'
  })
  building: Building;

}
