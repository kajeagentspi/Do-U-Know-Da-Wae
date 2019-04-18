import { getRepository } from 'typeorm';
import { Building, Stop } from '../entities';
import buildings from './buildings'

const seedData = {
  stops: [
    // { lat: 14.1516795, lng: 121.2338884, name: 'title' },
    // { lat: 14.1519177, lng: 121.2353384, name: 'title' },
    // { lat: 14.1523148, lng: 121.2342491, name: 'title' },
    // { lat: 14.1527581, lng: 121.2350554, name: 'title' },
    // { lat: 14.1534830, lng: 121.2351114, name: 'title' },
    // { lat: 14.1535811, lng: 121.2352553, name: 'title' },
    // { lat: 14.1541820, lng: 121.2355887, name: 'title' },
    // { lat: 14.1547361, lng: 121.2360272, name: 'title' },
    // { lat: 14.1552239, lng: 121.2349496, name: 'title' },
    // { lat: 14.1556645, lng: 121.2366554, name: 'title' },
    // { lat: 14.1558111, lng: 121.2351684, name: 'title' },
    // { lat: 14.1567540, lng: 121.2358104, name: 'FPRDI' },
    // { lat: 14.1568823, lng: 121.2362150, name: 'title' },
    // { lat: 14.1589717, lng: 121.2374757, name: 'Copeland Heigths', type: 'kanan' },
    // { lat: 14.1590402, lng: 121.2374404, name: 'Copeland Heigths', type: 'kaliwa' },
    // { lat: 14.1600217, lng: 121.2380474, name: 'CPAF', type: 'kanan' },
    // { lat: 14.1600970, lng: 121.2378801, name: 'CPAF', type: 'kaliwa' },
    // { lat: 14.1620914, lng: 121.2388429, name: 'UHS', type: 'kaliwa' },
    // { lat: 14.1621055, lng: 121.2389323, name: 'UHS', type: 'kanan' },
    { lat: 14.1636436, lng: 121.2425354, name: 'Physci', type: 'kaliwa' },
    { lat: 14.1637120, lng: 121.2423962, name: 'Physci', type: 'kaliwa' },
    { lat: 14.1637910, lng: 121.2415592, name: 'Physci', type: 'kaliwa' },
    { lat: 14.1638784, lng: 121.2413639, name: 'Physci', type: 'kanan' },
    { lat: 14.1597934, lng: 121.2436166, name: 'AnSci', type: 'kaliwa' },
    { lat: 14.1598585, lng: 121.2434548, name: 'AnSci', type: 'kanan' },
    { lat: 14.1601432, lng: 121.2444066, name: 'FoodTech', type: 'kaliwa' },
    { lat: 14.1602150, lng: 121.2446384, name: 'Agronomy', type: 'kanan' },
    { lat: 14.1608523, lng: 121.2449352, name: 'CEAT', type: 'kaliwa' },
    { lat: 14.1609052, lng: 121.2450380, name: 'CEAT', type: 'kanan' },
    { lat: 14.1609739, lng: 121.2414561, name: 'YMCA', type: 'kaliwa' },
    { lat: 14.1612352, lng: 121.2409200, name: 'Men\'s Dorm,Kaliwa|Kanan' },
    { lat: 14.1613905, lng: 121.2422655, name: 'Baker', type: 'kanan' },
    { lat: 14.1614215, lng: 121.2424934, name: 'Baker', type: 'kaliwa' },
    { lat: 14.1616870, lng: 121.2408855, name: 'FPark', type: 'kanan' },
    { lat: 14.1622763, lng: 121.2404891, name: 'Women\'s Dorm,Kaliwa|Kanan' },
    { lat: 14.1626671, lng: 121.2438100, name: 'Senior\'s Social Garden', type: 'kaliwa' },
    { lat: 14.1626702, lng: 121.2438536, name: 'Senior\'s Social Garden', type: 'kanan' },
    { lat: 14.1628143, lng: 121.2413658, name: 'SU', type: 'kaliwa' },
    { lat: 14.1628542, lng: 121.2411535, name: 'SU', type: 'kanan' },
    { lat: 14.1634401, lng: 121.2435869, name: 'PhySci', type: 'kaliwa' },
    { lat: 14.1634643, lng: 121.2437679, name: 'PhySci', type: 'kanan' },
    { lat: 14.1635769, lng: 121.2406342, name: 'Mariang Banga', type: 'kanan' },
    { lat: 14.1636534, lng: 121.2400171, name: 'DL Umali', type: 'kaliwa' },
    { lat: 14.1637471, lng: 121.2399205, name: 'DL Umali', type: 'kanan' },
    { lat: 14.1650748, lng: 121.2445290, name: 'Math Building,St. Therese', type: 'kaliwa' },
    { lat: 14.1650861, lng: 121.2446069, name: 'Math Building,St. Therese', type: 'kanan' },
    { lat: 14.1654236, lng: 121.2385843, name: 'Main Lib', type: 'kaliwa' },
    { lat: 14.1654993, lng: 121.2385293, name: 'Main Lib', type: 'kanan' },
    { lat: 14.1658894, lng: 121.2441851, name: 'Maquling School', type: 'kaliwa' },
    { lat: 14.1662999, lng: 121.2385700, name: 'Sacay', type: 'kaliwa' },
    { lat: 14.1665156, lng: 121.2387514, name: 'Sacay', type: 'kanan' },
    { lat: 14.1669733, lng: 121.2399398, name: 'BioSci', type: 'kaliwa' },
    { lat: 14.1669832, lng: 121.2436838, name: 'UP Gate', type: 'kaliwa' },
    { lat: 14.1670048, lng: 121.2437459, name: 'UP Gate', type: 'kanan' },
    { lat: 14.1671303, lng: 121.2401897, name: 'BioSci', type: 'kanan' },
    { lat: 14.1673357, lng: 121.2407525, name: 'Humanities', type: 'kaliwa' },
    { lat: 14.1675438, lng: 121.2429887, name: 'UP Gate', type: 'kaliwa' },
    { lat: 14.1676036, lng: 121.2430325, name: 'UP Gate', type: 'kanan' },
    { lat: 14.1676533, lng: 121.2413970, name: 'Raymundo', type: 'kanan' },
    { lat: 14.1677242, lng: 121.2416524, name: 'Raymundo', type: 'kaliwa' },
  ]
}

class Seeder {
  private buildingRepository = getRepository(Building);
  private stopRepository = getRepository(Stop);
  async seedBuildings() {
    await Promise.all(
      buildings.features.map(building => {
        const { coordinates } = building.geometry;
        const buildingCode = building.properties['@id'];
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
  async seedStops() {
    await Promise.all(
      seedData.stops.map(stop => {
        return this.stopRepository.save(stop);
      }),
    );
  }
}

export default Seeder;
