import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allRoute = data => {
  let { origin, destination } = data;
  origin = {
    id: origin.id,
    type: origin.type,
    lat: origin.lat,
    lng: origin.lng,
    name: origin.name
  };
  destination = {
    id: destination.id,
    type: destination.type,
    lat: destination.lat,
    lng: destination.lng,
    name: destination.name
  };
  return axios.get(
    `${baseURL}/api/route?${qs.stringify({ origin, destination })}`
  );
};

export const oneRoute = id => {
  return axios.get(`${baseURL}/api/route/${id}`);
};

export const saveRoute = data => {
  return axios.post(`${baseURL}/api/route`, data);
};

export const bookmarkRoute = data => {
  return axios.post(`${baseURL}/api/bookmark`, data);
};

export const reportRoute = data => {
  return axios.post(`${baseURL}/api/report`, data);
};

export const reportedRoute = () => {
  return axios.get(`${baseURL}/api/reported`);
};

export const processReportRoute = data => {
  return axios.post(`${baseURL}/api/processReport`, data);
};

export const removeBookmark = data => {
  return axios.post(`${baseURL}/api/removebookmark`, data);
};

export const removeRoute = id => {
  return axios.delete(`${baseURL}/api/route/${id}`);
};
