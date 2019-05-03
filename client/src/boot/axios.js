import axios from "axios";
import firebase from "firebase/app";

axios.interceptors.request.use(
  async config => {
    try {
      config.headers.token = await firebase.auth().currentUser.getIdToken();
    } catch (e) {
      console.log("not logged in");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default () => {};
