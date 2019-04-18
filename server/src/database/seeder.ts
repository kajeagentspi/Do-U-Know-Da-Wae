import { getRepository } from 'typeorm';
import { Building } from '../entities';
import buildings from './buildings'

const seed = async () => {
  
}

class Seeder {
  private buildingRepository = getRepository(Building);
  async seedBuildings() {
    await Promise.all(
      buildings.features.map(building => {
        const { coordinates } = building.geometry;
        const buildingCode = building.properties["@id"];
        const name = building.properties.name;
        const alternativeNames = building.properties.alt_name;
        return this.buildingRepository.save({
          coordinates,
          buildingCode,
          name,
          alternativeNames,
        });
      }),
    );
  }
}

export default Seeder;
