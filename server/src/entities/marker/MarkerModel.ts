import { ChildEntity, Column } from 'typeorm';
import { POI } from '..';

@ChildEntity()
export class Marker extends POI {

  @Column({ default: null })
  name: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

}
