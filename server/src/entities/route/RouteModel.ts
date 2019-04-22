import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column
} from "typeorm";
import { POI, Path, User } from "..";

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Path)
  @JoinTable()
  paths: Path[];

  @Column({ type: "float", nullable: true })
  distance: number;

  @Column({ type: "float", nullable: true })
  duration: number;

  @ManyToOne(type => User, user => user.contributions, {
    onDelete: "CASCADE"
  })
  contributor: User;

  @ManyToOne(type => POI, poi => poi.startRoutes, {
    onDelete: "CASCADE"
  })
  origin: POI;

  @ManyToOne(type => POI, poi => poi.endRoutes, {
    onDelete: "CASCADE"
  })
  destination: POI;
}
