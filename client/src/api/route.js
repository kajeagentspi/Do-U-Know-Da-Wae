import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const getRoutes = data => {
  return axios.get(`${baseURL}/api/route?${qs.stringify(data)}`);
};
