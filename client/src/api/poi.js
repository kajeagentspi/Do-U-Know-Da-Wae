import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const allPOI = data => {
  return axios.get(`${baseURL}/api/poi?${qs.stringify(data)}`);
};
