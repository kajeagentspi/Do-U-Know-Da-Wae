import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allRoom = data => {
  return axios.get(`${baseURL}/api/room?${qs.stringify(data)}`);
};

export const oneRoom = id => {
  return axios.get(`${baseURL}/api/room/${id}`);
};

export const saveRoom = data => {
  return axios.post(`${baseURL}/api/room`, data);
};

export const removeRoom = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/room/${id}`, {
    data: { accessToken }
  });
};
