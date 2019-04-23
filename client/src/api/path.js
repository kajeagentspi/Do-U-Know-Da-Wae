import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allPath = data => {
  return axios.get(`${baseURL}/api/path?${qs.stringify(data)}`);
};
