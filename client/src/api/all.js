import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const getAll = data => {
  return axios.get(`${baseURL}/api/all?${qs.stringify(data)}`);
};
