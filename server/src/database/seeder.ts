import { getRepository } from "typeorm";
import {
  Stop,
  StopDirection,
  User,
  UserType,
  Building,
  Route,
  Path,
  PathType
} from "../entities";
import buildings from "./buildings";
import polygonCenter from "geojson-polygon-center";
import { driving } from "../entities/config";
import axios from "axios";
import * as polyline from "@mapbox/polyline";

const seedData = {
  stops: [
    {
      lat: 14.1669832,
      lng: 121.2436838,
      name: "UP Gate",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1658894,
      lng: 121.2441851,
      name: "Maquiling School",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1650748,
      lng: 121.244529,
      name: "Math Building,St. Therese",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1634401,
      lng: 121.2435869,
      name: "PhySci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1626671,
      lng: 121.24381,
      name: "Senior's Social Garden",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1608523,
      lng: 121.2449352,
      name: "CEAT",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1601432,
      lng: 121.2444066,
      name: "FoodTech",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1597934,
      lng: 121.2436166,
      name: "AnSci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1614215,
      lng: 121.2424934,
      name: "Baker",
      direction: StopDirection.KALIWA
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
      lat: 14.1622763,
      lng: 121.2404891,
      name: "Women's Dorm",
      direction: StopDirection.BOTH
    },
    {
      lat: 14.1636534,
      lng: 121.2400171,
      name: "DL Umali",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1654236,
      lng: 121.2385843,
      name: "Main Lib",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1662999,
      lng: 121.23857,
      name: "Sacay",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1669733,
      lng: 121.2399398,
      name: "BioSci",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1673357,
      lng: 121.2407525,
      name: "Humanities",
      direction: StopDirection.KALIWA
    },
    {
      lat: 14.1677242,
      lng: 121.2416524,
      name: "Raymundo",
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
      lat: 14.1671303,
      lng: 121.2401897,
      name: "BioSci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1665156,
      lng: 121.2387514,
      name: "Sacay",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1654993,
      lng: 121.2385293,
      name: "Main Lib",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1637471,
      lng: 121.2399205,
      name: "DL Umali",
      direction: StopDirection.KANAN
    },
    // womens
    {
      lat: 14.161687,
      lng: 121.2408855,
      name: "FPark",
      direction: StopDirection.KANAN
    },
    // mens
    {
      lat: 14.1613905,
      lng: 121.2422655,
      name: "Baker",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1598585,
      lng: 121.2434548,
      name: "AnSci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.160215,
      lng: 121.2446384,
      name: "Agronomy",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1609052,
      lng: 121.245038,
      name: "CEAT",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1626702,
      lng: 121.2438536,
      name: "Senior's Social Garden",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1634643,
      lng: 121.2437679,
      name: "PhySci",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1650861,
      lng: 121.2446069,
      name: "Math Building,St. Therese",
      direction: StopDirection.KANAN
    },
    {
      lat: 14.1670048,
      lng: 121.2437459,
      name: "UP Gate",
      direction: StopDirection.KANAN
    }
  ],
  users: [
    {
      name: "Jake Marbert Tagnepis",
      email: "jptagnepis@up.edu.ph",
      type: UserType.ADMIN,
      uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
    }
  ],
  stopRoutes: [
    {
      origin: {
        lat: 14.1669832,
        lng: 121.2436838
      },
      destination: {
        lat: 14.1658894,
        lng: 121.2441851
      }
    },
    {
      origin: {
        lat: 14.1658894,
        lng: 121.2441851
      },
      destination: {
        lat: 14.1650748,
        lng: 121.244529
      }
    },
    {
      origin: {
        lat: 14.1650748,
        lng: 121.244529
      },
      destination: {
        lat: 14.1634401,
        lng: 121.2435869
      }
    },
    {
      origin: {
        lat: 14.1634401,
        lng: 121.2435869
      },
      destination: {
        lat: 14.1626671,
        lng: 121.24381
      }
    },
    {
      origin: {
        lat: 14.1626671,
        lng: 121.24381
      },
      destination: {
        lat: 14.1608523,
        lng: 121.2449352
      }
    },
    {
      origin: {
        lat: 14.1608523,
        lng: 121.2449352
      },
      destination: {
        lat: 14.1601432,
        lng: 121.2444066
      }
    },
    {
      origin: {
        lat: 14.1601432,
        lng: 121.2444066
      },
      destination: {
        lat: 14.1597934,
        lng: 121.2436166
      }
    },
    {
      origin: {
        lat: 14.1597934,
        lng: 121.2436166
      },
      destination: {
        lat: 14.1614215,
        lng: 121.2424934
      }
    },
    {
      origin: {
        lat: 14.1614215,
        lng: 121.2424934
      },
      destination: {
        lat: 14.1609739,
        lng: 121.2414561
      }
    },
    {
      origin: {
        lat: 14.1609739,
        lng: 121.2414561
      },
      destination: {
        lat: 14.1612352,
        lng: 121.24092
      }
    },
    {
      origin: {
        lat: 14.1612352,
        lng: 121.24092
      },
      destination: {
        lat: 14.1622763,
        lng: 121.2404891
      }
    },
    {
      origin: {
        lat: 14.1622763,
        lng: 121.2404891
      },
      destination: {
        lat: 14.1636534,
        lng: 121.2400171
      }
    },
    {
      origin: {
        lat: 14.1636534,
        lng: 121.2400171
      },
      destination: {
        lat: 14.1654236,
        lng: 121.2385843
      }
    },
    {
      origin: {
        lat: 14.1654236,
        lng: 121.2385843
      },
      destination: {
        lat: 14.1662999,
        lng: 121.23857
      }
    },
    {
      origin: {
        lat: 14.1662999,
        lng: 121.23857
      },
      destination: {
        lat: 14.1669733,
        lng: 121.2399398
      }
    },
    {
      origin: {
        lat: 14.1669733,
        lng: 121.2399398
      },
      destination: {
        lat: 14.1673357,
        lng: 121.2407525
      }
    },
    {
      origin: {
        lat: 14.1673357,
        lng: 121.2407525
      },
      destination: {
        lat: 14.1677242,
        lng: 121.2416524
      }
    },
    {
      origin: {
        lat: 14.1677242,
        lng: 121.2416524
      },
      destination: {
        lat: 14.1675438,
        lng: 121.2429887
      }
    },
    {
      origin: {
        lat: 14.1676036,
        lng: 121.2430325
      },
      destination: {
        lat: 14.1676533,
        lng: 121.241397
      }
    },
    {
      origin: {
        lat: 14.1676533,
        lng: 121.241397
      },
      destination: {
        lat: 14.1671303,
        lng: 121.2401897
      }
    },
    {
      origin: { lat: 14.1671303, lng: 121.2401897 },
      destination: {
        lat: 14.1665156,
        lng: 121.2387514
      }
    },
    {
      origin: {
        lat: 14.1665156,
        lng: 121.2387514
      },
      destination: {
        lat: 14.1654993,
        lng: 121.2385293
      }
    },
    {
      origin: {
        lat: 14.1654993,
        lng: 121.2385293
      },
      destination: {
        lat: 14.1637471,
        lng: 121.2399205
      }
    },
    {
      origin: {
        lat: 14.1637471,
        lng: 121.2399205
      },
      destination: {
        lat: 14.1622763,
        lng: 121.2404891
      }
    },
    {
      origin: {
        lat: 14.1622763,
        lng: 121.2404891
      },
      destination: {
        lat: 14.161687,
        lng: 121.2408855
      }
    },
    {
      origin: {
        lat: 14.161687,
        lng: 121.2408855
      },
      destination: {
        lat: 14.1612352,
        lng: 121.24092
      }
    },
    {
      origin: {
        lat: 14.1612352,
        lng: 121.24092
      },
      destination: {
        lat: 14.1613905,
        lng: 121.2422655
      }
    },
    {
      origin: {
        lat: 14.1613905,
        lng: 121.2422655
      },
      destination: {
        lat: 14.1598585,
        lng: 121.2434548
      }
    },
    {
      origin: {
        lat: 14.1598585,
        lng: 121.2434548
      },
      destination: {
        lat: 14.160215,
        lng: 121.2446384
      }
    },
    {
      origin: {
        lat: 14.160215,
        lng: 121.2446384
      },
      destination: {
        lat: 14.1609052,
        lng: 121.245038
      }
    },
    {
      origin: {
        lat: 14.1609052,
        lng: 121.245038
      },
      destination: {
        lat: 14.1626702,
        lng: 121.2438536
      }
    },
    {
      origin: {
        lat: 14.1626702,
        lng: 121.2438536
      },
      destination: {
        lat: 14.1634643,
        lng: 121.2437679
      }
    },
    {
      origin: {
        lat: 14.1634643,
        lng: 121.2437679
      },
      destination: {
        lat: 14.1650861,
        lng: 121.2446069
      }
    },
    {
      origin: {
        lat: 14.1650861,
        lng: 121.2446069
      },
      destination: {
        lat: 14.1670048,
        lng: 121.2437459
      }
    }
  ]
};

class Seeder {
  private buildingRepository = getRepository(Building);
  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);
  private routeRepository = getRepository(Route);
  private pathRepository = getRepository(Path);

  async seedUsers() {
    await Promise.all(
      seedData.users.map(user => {
        return this.userRepository.save(user);
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

  async seedStopRoutes() {
    const contributor = await this.userRepository.findOne(null, {
      where: {
        uid: "sxdtxH1nOiYizjEMFKjK2EtFruk1"
      }
    });
    for (let route of seedData.stopRoutes) {
      let { origin, destination } = route;
      const searchString = `${origin.lng},${origin.lat};${destination.lng},${
        destination.lat
      }`;
      const {
        data: { routes: paths }
      } = await axios.get(`${driving}/${searchString}?overview=full`);
      const { geometry, distance, duration } = paths[0];
      const startStop = await this.stopRepository.findOne(null, {
        where: { ...origin }
      });
      const endStop = await this.stopRepository.findOne(null, {
        where: { ...destination }
      });
      const path = await this.pathRepository.save({
        origin: startStop,
        destination: endStop,
        type: PathType.JEEP,
        latLngs: polyline.decode(geometry),
        geometry,
        distance,
        duration
      });
      await this.routeRepository.save({
        origin: startStop,
        destination: endStop,
        paths: [path],
        distance,
        duration,
        pathString: `${path.id}`,
        contributor
      });
    }
  }
}

export default Seeder;
