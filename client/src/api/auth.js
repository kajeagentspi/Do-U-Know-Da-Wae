import axios from "axios";
import { baseURL } from "./config";

export const saveUser = ({ accessToken }) =>
  axios.post(`${baseURL}/api/user`, { accessToken });
