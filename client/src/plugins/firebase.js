import firebase from 'firebase/app';
import 'firebase/auth';
import config from '../firebase.config.json';

export const fireApp = firebase.initializeApp(config);

export const AUTH = fireApp.auth();

export default ({ Vue }) => {
  Vue.prototype.$auth = AUTH;
  console.log(AUTH);
};
