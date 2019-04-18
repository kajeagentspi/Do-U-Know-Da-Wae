import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Building } from '..';

@Entity()
export class Exit {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lat: 'float';

  @Column()
  lng: 'float';

  @ManyToOne(type => Building, building => building.exits, {
    onDelete: 'CASCADE'
  })
  building: Building;
}
