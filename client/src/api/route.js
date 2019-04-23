import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allRoute = data => {
  return axios.get(`${baseURL}/api/route?${qs.stringify(data)}`);
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
