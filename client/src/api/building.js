import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allBuilding = data => {
  return axios.get(`${baseURL}/api/building?${qs.stringify(data)}`);
};

export const oneBuilding = id => {
  return axios.get(`${baseURL}/api/building/${id}`);
};

export const identifyBuilding = data => {
  return axios.get(`${baseURL}/api/identify?${qs.stringify(data)}`);
};

export const saveBuilding = data => {
  return axios.post(`${baseURL}/api/building`, data);
};

export const removeBuilding = id => {
  return axios.delete(`${baseURL}/api/building/${id}`);
};
