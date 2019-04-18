import { Column, ChildEntity } from 'typeorm';
import { POI } from '..';

export enum StopDirection {
  KALIWA = 'kaliwa',
  KANAN = 'kanan',
  BOTH = 'kaliwa|kanan'
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

  @Column({ type: 'enum', enum: StopDirection })
  direction: StopDirection
  
}
