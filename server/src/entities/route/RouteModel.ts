import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from "typeorm";
import { User, POI, Path } from "..";

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => POI, poi => poi.startRoutes, {
    onDelete: "CASCADE"
  })
  start: POI;

  @ManyToOne(type => POI, poi => poi.endRoutes, {
    onDelete: "CASCADE"
  })
  end: POI;

  @ManyToMany(type => Path)
  @JoinTable()
  paths: Path[];

  @ManyToOne(type => User, user => user.contributions, {
    onDelete: "CASCADE"
  })
  contributor: User;
}
