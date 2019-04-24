import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allRoute = data => {
  let { origin, destination } = data;
  origin = {
    id: origin.id,
    type: origin.type,
    lat: origin.lat,
    lng: origin.lng
  };
  destination = {
    id: destination.id,
    type: destination.type,
    lat: destination.lat,
    lng: destination.lng
  };
  return axios.get(
    `${baseURL}/api/route?${qs.stringify({ origin, destination })}`
  );
};

export const oneRoute = id => {
  return axios.get(`${baseURL}/api/route/${id}`);
};

export const saveRoute = data => {
  return axios.post(`${baseURL}/api/route}`, data);
};

export const removeRoute = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/route/${id}`, {
    data: { accessToken }
  });
};
