import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Building, POI } from '..';

@ChildEntity()
export class Exit extends POI {

  @Column()
  lat: 'double';

  @Column()
  lng: 'double';

  @ManyToOne(type => Building, building => building.exits, {
    onDelete: 'CASCADE'
  })
  building: Building;
  
}
