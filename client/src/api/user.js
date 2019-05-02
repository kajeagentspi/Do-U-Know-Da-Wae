import axios from "axios";
import { baseURL } from "./config";

export const getUser = () => {
  return axios.post(`${baseURL}/api/user`);
};

export const saveUser = data => {
  return axios.post(`${baseURL}/api/login`, data);
};
