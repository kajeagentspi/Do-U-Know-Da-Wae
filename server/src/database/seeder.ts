import { getRepository } from "typeorm";
import {
  Stop,
  StopDirection,
  User,
  UserType,
  Building,
  Route,
  Path,
  PathType,
  Room
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
  kaliwaStops: [
    {
      lat: 14.1669832,
      lng: 121.2436838
    },
    {
      lat: 14.1658894,
      lng: 121.2441851
    },
    {
      lat: 14.1650748,
      lng: 121.244529
    },
    {
      lat: 14.1634401,
      lng: 121.2435869
    },
    {
      lat: 14.1626671,
      lng: 121.24381
    },
    {
      lat: 14.1608523,
      lng: 121.2449352
    },
    {
      lat: 14.1601432,
      lng: 121.2444066
    },
    {
      lat: 14.1597934,
      lng: 121.2436166
    },
    {
      lat: 14.1614215,
      lng: 121.2424934
    },
    {
      lat: 14.1609739,
      lng: 121.2414561
    },
    {
      lat: 14.1612352,
      lng: 121.24092
    },
    {
      lat: 14.1622763,
      lng: 121.2404891
    },
    {
      lat: 14.1636534,
      lng: 121.2400171
    },
    {
      lat: 14.1654236,
      lng: 121.2385843
    },
    {
      lat: 14.1662999,
      lng: 121.23857
    },
    {
      lat: 14.1669733,
      lng: 121.2399398
    },
    {
      lat: 14.1673357,
      lng: 121.2407525
    },
    {
      lat: 14.1677242,
      lng: 121.2416524
    },
    {
      lat: 14.1675438,
      lng: 121.2429887
    }
  ],
  kananStops: [
    {
      lat: 14.1676036,
      lng: 121.2430325
    },
    {
      lat: 14.1676533,
      lng: 121.241397
    },
    {
      lat: 14.1671303,
      lng: 121.2401897
    },
    {
      lat: 14.1665156,
      lng: 121.2387514
    },
    {
      lat: 14.1654993,
      lng: 121.2385293
    },
    {
      lat: 14.1637471,
      lng: 121.2399205
    },
    {
      lat: 14.1622763,
      lng: 121.2404891
    },
    {
      lat: 14.161687,
      lng: 121.2408855
    },
    {
      lat: 14.1612352,
      lng: 121.24092
    },
    {
      lat: 14.1613905,
      lng: 121.2422655
    },
    {
      lat: 14.1598585,
      lng: 121.2434548
    },
    {
      lat: 14.160215,
      lng: 121.2446384
    },
    {
      lat: 14.1609052,
      lng: 121.245038
    },
    {
      lat: 14.1626702,
      lng: 121.2438536
    },
    {
      lat: 14.1634643,
      lng: 121.2437679
    },
    {
      lat: 14.1650861,
      lng: 121.2446069
    },
    {
      lat: 14.1670048,
      lng: 121.2437459
    }
  ],
  rooms: [
    { name: "CAS 101", level: 1, buildingCode: "way/33541786" },
    { name: "CAS 102", level: 1, buildingCode: "way/33541786" },
    { name: "CAS 103", level: 1, buildingCode: "way/33541786" },
    { name: "CAS 108", level: 1, buildingCode: "way/33541786" },
    { name: "CAS 109", level: 1, buildingCode: "way/33541786" },
    { name: "CAS 110", level: 1, buildingCode: "way/33541786" },
    { name: "CAS B01", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B02", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B03", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B04", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B05", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B06", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B07", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B08", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B09", level: -1, buildingCode: "way/33541786" },
    { name: "CAS B10", level: -1, buildingCode: "way/33541786" },
    { name: "CAS A1 302", level: 3, buildingCode: "relation/1066549" },
    { name: "CAS A1 303", level: 3, buildingCode: "relation/1066549" },
    { name: "CAS A1 304", level: 3, buildingCode: "relation/1066549" },
    { name: "CAS A1 305", level: 3, buildingCode: "relation/1066549" },
    { name: "CAS A1 306", level: 3, buildingCode: "relation/1066549" },
    { name: "CAS A1 402", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 403", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 404", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 405", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 406", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 407", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 408", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 409", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 410", level: 4, buildingCode: "relation/1066549" },
    { name: "CAS A1 Gal1", level: 1, buildingCode: "relation/1066549" },
    { name: "CAS A1 Gal2", level: 1, buildingCode: "relation/1066549" },
    { name: "CAS A2 101", level: 1, buildingCode: "way/486667196" },
    { name: "CAS A2 102", level: 1, buildingCode: "way/486667196" },
    { name: "CAS A2 103", level: 1, buildingCode: "way/486667196" },
    { name: "CAS A2 201", level: 2, buildingCode: "way/486667196" },
    { name: "CAS A2 202", level: 2, buildingCode: "way/486667196" },
    { name: "CAS A2 203", level: 2, buildingCode: "way/486667196" },
    { name: "CAS ANNEX 2 MPH 1", level: 1, buildingCode: "way/486667196" },
    { name: "CAS ANNEX 2 MPH 2", level: 2, buildingCode: "way/486667196" },
    { name: "ICS GS Rm", level: 3, buildingCode: "way/44076412" },
    { name: "ICS PC1", level: 2, buildingCode: "way/44076412" },
    { name: "ICS PC2", level: 2, buildingCode: "way/44076412" },
    { name: "ICS PC3", level: 2, buildingCode: "way/44076412" },
    { name: "ICS PC4", level: 2, buildingCode: "way/44076412" },
    { name: "ICS PC5", level: 2, buildingCode: "way/44076412" },
    { name: "ICS PC6", level: 3, buildingCode: "way/44076412" },
    { name: "ICS PC7", level: 3, buildingCode: "way/44076412" },
    { name: "ICS PC8", level: 3, buildingCode: "way/44076412" },
    { name: "ICS PC9", level: 3, buildingCode: "way/44076412" },
    { name: "ICS PS C-100", level: 2, buildingCode: "way/44076412" },
    { name: "ICSLH3", level: 3, buildingCode: "way/44076412" },
    { name: "ICSLH4", level: 3, buildingCode: "way/44076412" },
    { name: "ICSMH", level: 2, buildingCode: "way/44076412" },
    { name: "PS A-102", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-105", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-121", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-124", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-127", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-133", level: 1, buildingCode: "way/44076412" },
    { name: "PS A-225", level: 2, buildingCode: "way/44076412" },
    { name: "PS A-227", level: 2, buildingCode: "way/44076412" },
    { name: "PS A-232", level: 2, buildingCode: "way/44076412" },
    { name: "PS A-305", level: 3, buildingCode: "way/44076412" },
    { name: "PS A-311", level: 3, buildingCode: "way/44076412" },
    { name: "PS A-321", level: 3, buildingCode: "way/44076412" },
    { name: "PS B-100", level: 1, buildingCode: "way/44076412" },
    { name: "PS B-101", level: 1, buildingCode: "way/44076412" },
    { name: "PS B-103", level: 1, buildingCode: "way/44076412" },
    { name: "PS B-200", level: 2, buildingCode: "way/44076412" },
    { name: "PS B-201", level: 2, buildingCode: "way/44076412" },
    { name: "PS B-203", level: 2, buildingCode: "way/44076412" },
    { name: "PS B-204", level: 2, buildingCode: "way/44076412" },
    { name: "PS B-205", level: 2, buildingCode: "way/44076412" },
    { name: "PS B-309", level: 3, buildingCode: "way/44076412" },
    { name: "PS C-101", level: 1, buildingCode: "way/44076412" },
    { name: "PS C-203", level: 2, buildingCode: "way/44076412" },
    { name: "PS C-204", level: 2, buildingCode: "way/44076412" },
    { name: "PS C-206", level: 2, buildingCode: "way/44076412" },
    { name: "PS C-212", level: 2, buildingCode: "way/44076412" },
    { name: "PS C-214", level: 2, buildingCode: "way/44076412" },
    { name: "PS C-304", level: 3, buildingCode: "way/44076412" },
    { name: "PS C-306", level: 3, buildingCode: "way/44076412" },
    { name: "PS C-307", level: 3, buildingCode: "way/44076412" },
    { name: "PS C-309", level: 3, buildingCode: "way/44076412" },
    { name: "PS C-312", level: 3, buildingCode: "way/44076412" },
    { name: "PSLH A", level: 1, buildingCode: "way/44076412" },
    { name: "PSLH B", level: 1, buildingCode: "way/44076412" }
  ]
};

class Seeder {
  private buildingRepository = getRepository(Building);
  private stopRepository = getRepository(Stop);
  private userRepository = getRepository(User);
  private routeRepository = getRepository(Route);
  private pathRepository = getRepository(Path);
  private roomRepository = getRepository(Room);
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
    const { kaliwaStops, kananStops } = seedData;
    for (let i = 0; i < kaliwaStops.length; i++) {
      const latLngs = [];
      let totalDistance = 0;
      let totalDuration = 0;
      const routeOrigin = kaliwaStops[i];
      const origin = await this.stopRepository.findOne(null, {
        where: { ...routeOrigin }
      });
      for (let j = i + 1; j < kaliwaStops.length - 1; j++) {
        const pathOrigin = kaliwaStops[j - 1];
        const pathDestination = kaliwaStops[j];
        const destination = await this.stopRepository.findOne(null, {
          where: { ...pathDestination }
        });
        const searchString = `${pathOrigin.lng},${pathOrigin.lat};${
          pathDestination.lng
        },${pathDestination.lat}`;
        const {
          data: { routes: paths }
        } = await axios.get(`${driving}/${searchString}?overview=full`);
        const { geometry, distance, duration } = paths[0];
        const legLatLngs = polyline.decode(geometry);
        latLngs.push(...legLatLngs);
        totalDistance += distance;
        totalDuration += duration;
        const totalGeometry = polyline.encode(latLngs);

        const path = await this.pathRepository.save({
          origin,
          destination,
          type: PathType.JEEP,
          latLngs: polyline.decode(totalGeometry),
          geometry: totalGeometry,
          distance: totalDistance,
          duration: totalDuration
        });

        await this.routeRepository.save({
          origin,
          destination,
          paths: [path],
          distance: totalDistance,
          duration: totalDuration,
          pathString: `${path.id}`,
          contributor
        });
      }
    }
    for (let i = 0; i < kananStops.length; i++) {
      const latLngs = [];
      let totalDistance = 0;
      let totalDuration = 0;
      const routeOrigin = kananStops[i];
      const origin = await this.stopRepository.findOne(null, {
        where: { ...routeOrigin }
      });
      for (let j = i + 1; j < kananStops.length - 1; j++) {
        const pathOrigin = kananStops[j - 1];
        const pathDestination = kananStops[j];
        const destination = await this.stopRepository.findOne(null, {
          where: { ...pathDestination }
        });
        const searchString = `${pathOrigin.lng},${pathOrigin.lat};${
          pathDestination.lng
        },${pathDestination.lat}`;
        const {
          data: { routes: paths }
        } = await axios.get(`${driving}/${searchString}?overview=full`);
        const { geometry, distance, duration } = paths[0];
        const legLatLngs = polyline.decode(geometry);
        latLngs.push(...legLatLngs);
        totalDistance += distance;
        totalDuration += duration;
        const totalGeometry = polyline.encode(latLngs);

        const path = await this.pathRepository.save({
          origin,
          destination,
          type: PathType.JEEP,
          latLngs: polyline.decode(totalGeometry),
          geometry: totalGeometry,
          distance: totalDistance,
          duration: totalDuration
        });

        await this.routeRepository.save({
          origin,
          destination,
          paths: [path],
          distance: totalDistance,
          duration: totalDuration,
          pathString: `${path.id}`,
          contributor
        });
      }
    }
  }

  async seedRooms() {
    for (let room of seedData.rooms) {
      const { name, buildingCode, level } = room;
      const building = await this.buildingRepository.findOne(null, {
        where: {
          buildingCode
        }
      });
      await this.roomRepository.save({
        name,
        level,
        building
      });
    }
  }
}

export default Seeder;
