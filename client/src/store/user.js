import { getField, updateField } from "vuex-map-fields";
import * as Api from "../api";
import { SET_USER } from "./types";

const user = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    profile: null,
    type: "viewer"
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    [SET_USER]: (state, payload) => {
      for (let key of Object.keys(payload)) {
        state[key] = payload[key];
      }
    }
  },
  actions: {
    setUser: async (context, payload) => {
      const { isAuthenticated, profile } = payload;
      try {
        if (isAuthenticated) {
          const result = await Api.saveUser();
          const { type } = result.data;
          context.commit(SET_USER, {
            isAuthenticated,
            profile,
            type
          });
        } else {
          context.commit(SET_USER, {
            isAuthenticated,
            profile: null,
            type: "viewer"
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
export default user;
