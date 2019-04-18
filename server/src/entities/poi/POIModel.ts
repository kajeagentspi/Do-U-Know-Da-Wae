import { PrimaryGeneratedColumn, OneToMany, Entity, TableInheritance } from 'typeorm';
import { Path, Route } from '..';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class POI {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(type => Path, path => path.start)
  startPaths: Path[];

  @OneToMany(type => Path, path => path.end)
  endPaths: Path[];

  @OneToMany(type => Route, route => route.start)
  startRoutes: Route[];

  @OneToMany(type => Route, route => route.end)
  endRoutes: Route[];
  
}
