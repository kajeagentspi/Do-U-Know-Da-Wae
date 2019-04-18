import { Column, ChildEntity } from 'typeorm';
import { POI } from '..';

export enum Direction {
  KALIWA = "kaliwa",
  KANAN = "kanan",
}

@ChildEntity()
export class Stop extends POI {

  @Column()
  name: string;

  @Column()

  @Column()
  lat: 'float';

  @Column()
  lng: 'float';

  @Column({
    type: "enum",
    enum: Direction,
    default: Direction.KALIWA
  })
  direction: Direction
  
}
