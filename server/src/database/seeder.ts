import { getRepository } from "typeorm";
import { Building, Stop, StopDirection, User } from "../entities";
import buildings from "./buildings";
import polygonCenter from "geojson-polygon-center";
import { UserType } from "../entities/user/UserModel";

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
    // { lat: 14.1589717, lng: 121.2374757, name: 'Copeland Heigths', direction: StopDirection.KANAN },
    // { lat: 14.1590402, lng: 121.2374404, name: 'Copeland Heigths', direction: StopDirection.KALIWA },
    // { lat: 14.1600217, lng: 121.2380474, name: 'CPAF', direction: StopDirection.KANAN },
    // { lat: 14.1600970, lng: 121.2378801, name: 'CPAF', direction: StopDirection.KALIWA },
    // { lat: 14.1620914, lng: 121.2388429, name: 'UHS', direction: StopDirection.KALIWA },
    // { lat: 14.1621055, lng: 121.2389323, name: 'UHS', direction: StopDirection.KANAN },
    {
      lat: 14.1636436,
      lng: 121.2425354,
      name: "Physci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.163712,
      lng: 121.2423962,
      name: "Physci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.163791,
      lng: 121.2415592,
      name: "Physci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1638784,
      lng: 121.2413639,
      name: "Physci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1597934,
      lng: 121.2436166,
      name: "AnSci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1598585,
      lng: 121.2434548,
      name: "AnSci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1601432,
      lng: 121.2444066,
      name: "FoodTech",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.160215,
      lng: 121.2446384,
      name: "Agronomy",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1608523,
      lng: 121.2449352,
      name: "CEAT",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1609052,
      lng: 121.245038,
      name: "CEAT",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1609739,
      lng: 121.2414561,
      name: "YMCA",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1612352,
      lng: 121.24092,
      name: "Men's Dorm",
      direction: StopDirection.BOTH
    },
    {
      lat: 14.1613905,
      lng: 121.2422655,
      name: "Baker",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1614215,
      lng: 121.2424934,
      name: "Baker",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.161687,
      lng: 121.2408855,
      name: "FPark",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1622763,
      lng: 121.2404891,
      name: "Women's Dorm",
      direction: StopDirection.BOTH
    },
    {
      lat: 14.1626671,
      lng: 121.24381,
      name: "Senior's Social Garden",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1626702,
      lng: 121.2438536,
      name: "Senior's Social Garden",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1628143,
      lng: 121.2413658,
      name: "SU",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1628542,
      lng: 121.2411535,
      name: "SU",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1634401,
      lng: 121.2435869,
      name: "PhySci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1634643,
      lng: 121.2437679,
      name: "PhySci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1635769,
      lng: 121.2406342,
      name: "Mariang Banga",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1636534,
      lng: 121.2400171,
      name: "DL Umali",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1637471,
      lng: 121.2399205,
      name: "DL Umali",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1650748,
      lng: 121.244529,
      name: "Math Building,St. Therese",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1650861,
      lng: 121.2446069,
      name: "Math Building,St. Therese",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1654236,
      lng: 121.2385843,
      name: "Main Lib",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1654993,
      lng: 121.2385293,
      name: "Main Lib",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1658894,
      lng: 121.2441851,
      name: "Maquling School",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1662999,
      lng: 121.23857,
      name: "Sacay",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1665156,
      lng: 121.2387514,
      name: "Sacay",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1669733,
      lng: 121.2399398,
      name: "BioSci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1669832,
      lng: 121.2436838,
      name: "UP Gate",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1670048,
      lng: 121.2437459,
      name: "UP Gate",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1671303,
      lng: 121.2401897,
      name: "BioSci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1673357,
      lng: 121.2407525,
      name: "Humanities",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1675438,
      lng: 121.2429887,
      name: "UP Gate",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1676036,
      lng: 121.2430325,
      name: "UP Gate",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1676533,
      lng: 121.241397,
      name: "Raymundo",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1677242,
      lng: 121.2416524,
      name: "Raymundo",
      direction: StopDirection.KALIWA
    }
  ],
  exits: [
    { lat: 14.1636177, lng: 121.2418056 },
    { lat: 14.1657418, lng: 121.2429869 },
    { lat: 14.1519659, lng: 121.2351709 },
    { lat: 14.1675072, lng: 121.2439087 },
    { lat: 14.1599476, lng: 121.2447804 },
    { lat: 14.1674978, lng: 121.2437456 },
    { lat: 14.1648804, lng: 121.2413416 },
    { lat: 14.1676451, lng: 121.2436695 },
    { lat: 14.1669133, lng: 121.2415651 },
    { lat: 14.1670355, lng: 121.2416332 },
    { lat: 14.1672466, lng: 121.2415566 },
    { lat: 14.1646197, lng: 121.2418772 },
    { lat: 14.1673723, lng: 121.2416137 },
    { lat: 14.1671974, lng: 121.2411939 },
    { lat: 14.1665046, lng: 121.2434471 },
    { lat: 14.166676, lng: 121.2432 },
    { lat: 14.1602707, lng: 121.2456137 },
    { lat: 14.1605107, lng: 121.2457484 },
    { lat: 14.1601444, lng: 121.2459601 },
    { lat: 14.1630596, lng: 121.2436584 },
    { lat: 14.1654425, lng: 121.2410243 },
    { lat: 14.1664965, lng: 121.2402162 },
    { lat: 14.1651192, lng: 121.2421218 },
    { lat: 14.1677037, lng: 121.2439676 },
    { lat: 14.1632139, lng: 121.2412811 },
    { lat: 14.1524442, lng: 121.2349863 },
    { lat: 14.1642259, lng: 121.2428016 },
    { lat: 14.1553248, lng: 121.2472454 },
    { lat: 14.1657052, lng: 121.2405117 },
    { lat: 14.1521847, lng: 121.2345191 },
    { lat: 14.1637527, lng: 121.2402621 },
    { lat: 14.1637927, lng: 121.2401429 },
    { lat: 14.1638582, lng: 121.2403443 },
    { lat: 14.1638644, lng: 121.2402991 },
    { lat: 14.158528, lng: 121.2475275 },
    { lat: 14.1509438, lng: 121.2479929 },
    { lat: 14.1523824, lng: 121.2487235 },
    { lat: 14.1673985, lng: 121.2437625 },
    { lat: 14.1673349, lng: 121.2423412 },
    { lat: 14.1646336, lng: 121.2419107 },
    { lat: 14.1636154, lng: 121.2416629 },
    { lat: 14.1577019, lng: 121.243285 },
    { lat: 14.1611588, lng: 121.2407278 },
    { lat: 14.1676225, lng: 121.2419463 },
    { lat: 14.1649892, lng: 121.2421841 },
    { lat: 14.1646055, lng: 121.2440265 },
    { lat: 14.1648318, lng: 121.2440247 },
    { lat: 14.1649341, lng: 121.2442826 },
    { lat: 14.1566184, lng: 121.2427417 },
    { lat: 14.1601905, lng: 121.2411252 },
    { lat: 14.1622631, lng: 121.2404613 },
    { lat: 14.1633279, lng: 121.2411562 },
    { lat: 14.1645605, lng: 121.241859 },
    { lat: 14.1650425, lng: 121.240541 },
    { lat: 14.1522072, lng: 121.2343599 },
    { lat: 14.1604952, lng: 121.2471424 },
    { lat: 14.161645, lng: 121.24778 },
    { lat: 14.1658078, lng: 121.2439482 },
    { lat: 14.1655259, lng: 121.2440717 },
    { lat: 14.1665877, lng: 121.2404373 },
    { lat: 14.1684843, lng: 121.2418724 },
    { lat: 14.1599174, lng: 121.245392 },
    { lat: 14.1586541, lng: 121.2428964 },
    { lat: 14.1587746, lng: 121.2429118 },
    { lat: 14.1590758, lng: 121.2431964 },
    { lat: 14.1680877, lng: 121.2436364 },
    { lat: 14.1681401, lng: 121.2437131 },
    { lat: 14.1615105, lng: 121.24758 },
    { lat: 14.1619327, lng: 121.2488532 },
    { lat: 14.1623813, lng: 121.2384371 },
    { lat: 14.1624208, lng: 121.2385257 },
    { lat: 14.1625528, lng: 121.2383432 },
    { lat: 14.162781, lng: 121.2389337 },
    { lat: 14.1633265, lng: 121.2395854 },
    { lat: 14.1634751, lng: 121.2393853 },
    { lat: 14.1636577, lng: 121.239384 },
    { lat: 14.1638455, lng: 121.2395249 },
    { lat: 14.1632753, lng: 121.2363259 },
    { lat: 14.1583781, lng: 121.2434935 },
    { lat: 14.1587866, lng: 121.2443289 },
    { lat: 14.1590643, lng: 121.2442483 },
    { lat: 14.1593309, lng: 121.241796 },
    { lat: 14.1516771, lng: 121.2338179 },
    { lat: 14.1615256, lng: 121.2447363 },
    { lat: 14.1652924, lng: 121.2389909 },
    { lat: 14.1655138, lng: 121.2391913 },
    { lat: 14.1597532, lng: 121.2446899 },
    { lat: 14.1561882, lng: 121.2412382 },
    { lat: 14.1676062, lng: 121.2411731 },
    { lat: 14.1559779, lng: 121.2363485 },
    { lat: 14.1653048, lng: 121.2423377 },
    { lat: 14.1603525, lng: 121.2443851 },
    { lat: 14.1606265, lng: 121.2440912 },
    { lat: 14.1644941, lng: 121.2429328 },
    { lat: 14.1641771, lng: 121.2425219 },
    { lat: 14.1644221, lng: 121.2424846 },
    { lat: 14.164156, lng: 121.2430824 },
    { lat: 14.1674751, lng: 121.2405369 },
    { lat: 14.1515559, lng: 121.2351928 },
    { lat: 14.1548738, lng: 121.2352679 },
    { lat: 14.1545348, lng: 121.2355484 },
    { lat: 14.1629055, lng: 121.2488844 },
    { lat: 14.1637045, lng: 121.2505122 },
    { lat: 14.1639216, lng: 121.2420969 },
    { lat: 14.1577782, lng: 121.2428708 },
    { lat: 14.1585212, lng: 121.2429827 },
    { lat: 14.1587922, lng: 121.243281 },
    { lat: 14.1588506, lng: 121.2434237 },
    { lat: 14.1582446, lng: 121.2425739 },
    { lat: 14.1668247, lng: 121.23903 },
    { lat: 14.1681607, lng: 121.2439625 },
    { lat: 14.1612844, lng: 121.2455316 },
    { lat: 14.1608005, lng: 121.2453891 },
    { lat: 14.1609833, lng: 121.2452889 },
    { lat: 14.1610451, lng: 121.245255 },
    { lat: 14.1610762, lng: 121.2459278 },
    { lat: 14.1606299, lng: 121.2400868 },
    { lat: 14.1607702, lng: 121.2400191 },
    { lat: 14.1608285, lng: 121.2401803 },
    { lat: 14.1606586, lng: 121.2403093 },
    { lat: 14.1614267, lng: 121.2458102 },
    { lat: 14.1612953, lng: 121.2455527 },
    { lat: 14.1612282, lng: 121.2459211 },
    { lat: 14.1612877, lng: 121.2458897 },
    { lat: 14.1616635, lng: 121.2481932 },
    { lat: 14.1607336, lng: 121.24324 },
    { lat: 14.1605819, lng: 121.2432181 },
    { lat: 14.1630683, lng: 121.2487171 }
  ],
  users: [
    {
      name: "Jake Marbert Tagnepis",
      email: "jptagnepis@up.edu.ph",
      type: UserType.ADMIN,
      uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
    }
  ]
};

class Seeder {
  private buildingRepository = getRepository(Building);
  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);
  async seedUsers() {
    await Promise.all(
      seedData.users.map(user => {
        return this.userRepository.save(user);
      })
    );
  }

  async seedBuildings() {
    await Promise.all(
      buildings.features.map(building => {
        const { coordinates } = building.geometry;
        const {
          coordinates: [lat, lng]
        } = polygonCenter(building.geometry);
        const buildingCode = building.properties["@id"];
        const name = building.properties.name;
        const alternativeNames = building.properties.alt_name;
        return this.buildingRepository.save({
          coordinates,
          buildingCode,
          name,
          alternativeNames,
          lat,
          lng
        });
      })
    );
  }
  async seedStops() {
    await Promise.all(
      seedData.stops.map(stop => {
        return this.stopRepository.save(stop);
      })
    );
  }
}

export default Seeder;
