import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const getBuildings = data => {
  return axios.get(`${baseURL}/api/building?${qs.stringify(data)}`);
};

export const getBuilding = id => {
  return axios.get(`${baseURL}/api/building/${id}`);
};

export const getBuildingIdentify = data => {
  return axios.get(`${baseURL}/api/building/identify?${qs.stringify(data)}`);
};

export const addBuilding = data => {
  return axios.post(`${baseURL}/api/building`, data);
};

export const deleteBuilding = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/building/${id}`, {
    data: { accessToken }
  });
};
