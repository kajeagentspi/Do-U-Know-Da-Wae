import { PrimaryGeneratedColumn, OneToMany, Entity, TableInheritance, Column } from 'typeorm';
import { Path, Route } from '..';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class POI {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToMany(type => Path, path => path.start, {
    onDelete: 'CASCADE'
  })
  startPaths: Path[];

  @OneToMany(type => Path, path => path.end, {
    onDelete: 'CASCADE'
  })
  endPaths: Path[];

  @OneToMany(type => Route, route => route.start, {
    onDelete: 'CASCADE'
  })
  startRoutes: Route[];

  @OneToMany(type => Route, route => route.end, {
    onDelete: 'CASCADE'
  })
  endRoutes: Route[];
  
  @Column()
  type: 'string';
  
}
