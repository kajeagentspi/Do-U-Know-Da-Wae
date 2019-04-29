import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allPath = data => {
  console.log(data);
  return axios.get(`${baseURL}/api/path?${qs.stringify(data)}`);
};
