import { Column, ChildEntity } from 'typeorm';
import { POI } from '..';

export enum Direction {
  KALIWA = 'kaliwa',
  KANAN = 'kanan',
}

@ChildEntity()
export class Stop extends POI {

  @Column()
  name: string;

  @Column()

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column({ type: 'enum', enum: Direction })
  direction: Direction
  
}
