import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Building, POI } from '..';

@ChildEntity()
export class Exit extends POI {

  @Column({ type: 'double'})
  lat: number;

  @Column({ type: 'double'})
  lng: number;

  @ManyToOne(type => Building, building => building.exits, {
    onDelete: 'CASCADE'
  })
  building: Building;
  
}
