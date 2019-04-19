import axios from "axios";
import qs from "qs";

export const reverseGeocode = ({ lat, lng: lon }) => {
  const query = {
    lat,
    lon,
    format: "json"
  };
  return axios.get(
    `https://nominatim.openstreetmap.org/reverse?${qs.stringify(query)}`
  );
};
