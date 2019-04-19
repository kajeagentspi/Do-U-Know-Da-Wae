import { getField, updateField } from "vuex-map-fields";
import * as Api from "../api";
import { SET_USER } from "./types";

const auth = {
  namespaced: true,
  state: {
    accessToken: null,
    profile: null,
    type: null
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    [SET_USER]: (state, payload) => {
      Object.assign(state, payload);
    }
  },
  actions: {
    setUser: async (context, payload) => {
      const { accessToken, profile } = payload;
      try {
        if (accessToken) {
          const result = await Api.saveUser({ accessToken });
          const { type } = result;
          context.commit(SET_USER, { accessToken, profile, type });
        } else {
          const type = null;
          context.commit(SET_USER, { accessToken, profile, type });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
export default auth;
