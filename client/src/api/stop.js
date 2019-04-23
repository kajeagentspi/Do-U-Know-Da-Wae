import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allStop = data => {
  return axios.get(`${baseURL}/api/stop?${qs.stringify(data)}`);
};

export const oneStop = id => {
  return axios.get(`${baseURL}/api/stop/${id}`);
};

export const saveStop = data => {
  return axios.post(`${baseURL}/api/stop`, data);
};

export const removeStop = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/stop/${id}`, {
    data: { accessToken }
  });
};
