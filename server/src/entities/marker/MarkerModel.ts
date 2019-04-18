import { ChildEntity, Column } from 'typeorm';
import { POI } from '..';

@ChildEntity()
export class Marker extends POI {

  @Column({ default: null })
  name: string;

  @Column({ type: 'double'})
  lat: number;

  @Column({ type: 'double'})
  lng: number;

}
