import axios from "axios";
import { baseURL } from "./config";
import qs from "qs";

export const getRooms = data => {
  return axios.get(`${baseURL}/api/room?${qs.stringify(data)}`);
};

export const getRoom = id => {
  return axios.get(`${baseURL}/api/room/${id}`);
};

export const addRoom = data => {
  return axios.post(`${baseURL}/api/room?${qs.stringify(data)}`);
};

export const deleteRoom = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/room/${id}`, { data: { accessToken } });
};

export const getStops = data => {
  return axios.get(`${baseURL}/api/stop?${qs.stringify(data)}`);
};

export const getStop = id => {
  return axios.get(`${baseURL}/api/stop/${id}`);
};

export const addStop = data => {
  return axios.post(`${baseURL}/api/stop?${qs.stringify(data)}`);
};

export const deleteStop = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/stop/${id}`, { data: { accessToken } });
};

export const getExits = data => {
  return axios.get(`${baseURL}/api/exit?${qs.stringify(data)}`);
};

export const getExit = id => {
  return axios.get(`${baseURL}/api/exit/${id}`);
};

export const addExit = data => {
  return axios.post(`${baseURL}/api/exit?${qs.stringify(data)}`);
};

export const deleteExit = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/exit/${id}`, { data: { accessToken } });
};

export const getMarkers = data => {
  return axios.get(`${baseURL}/api/marker?${qs.stringify(data)}`);
};

export const getMarker = id => {
  return axios.get(`${baseURL}/api/marker/${id}`);
};

export const addMarker = data => {
  return axios.post(`${baseURL}/api/marker?${qs.stringify(data)}`);
};

export const deleteMarker = ({ id, accessToken }) => {
  return axios.delete(`${baseURL}/api/marker/${id}`, { data: { accessToken } });
};
