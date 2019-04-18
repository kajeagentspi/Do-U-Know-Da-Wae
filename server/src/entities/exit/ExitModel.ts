import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Building, POI } from '..';

@ChildEntity()
export class Exit extends POI {

  @Column()
  lat: number;

  @Column()
  lng: number;

  @ManyToOne(type => Building, building => building.exits, {
    onDelete: 'CASCADE'
  })
  building: Building;
  
}
