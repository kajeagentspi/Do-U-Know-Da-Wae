import axios from "axios";
import { baseURL } from "./config";

export const saveUser = ({ accessToken }) => {
  return axios.post(`${baseURL}/api/user`, { accessToken });
};
