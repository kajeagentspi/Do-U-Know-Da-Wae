import {
  Entity,
  TableInheritance,
  PrimaryGeneratedColumn,
  OneToMany,
  Column
} from "typeorm";
import { Path, Route } from "..";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class POI {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Path, path => path.origin, {
    onDelete: "CASCADE"
  })
  startPaths: Path[];

  @OneToMany(type => Path, path => path.destination, {
    onDelete: "CASCADE"
  })
  endPaths: Path[];

  @OneToMany(type => Route, route => route.origin, {
    onDelete: "CASCADE"
  })
  startRoutes: Route[];

  @OneToMany(type => Route, route => route.destination, {
    onDelete: "CASCADE"
  })
  endRoutes: Route[];
}
