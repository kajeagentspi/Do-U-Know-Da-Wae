import axios from "axios";
import { baseURL } from "./config";

export const getUser = ({ accessToken }) => {
  return axios.post(`${baseURL}/api/user`, { accessToken });
};

export const saveUser = ({ accessToken }) => {
  return axios.post(`${baseURL}/api/login`, { accessToken });
};
