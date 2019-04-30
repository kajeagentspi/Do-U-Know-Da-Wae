import { getField, updateField } from "vuex-map-fields";
import * as Api from "../api";
import { SET_USER } from "./types";

const user = {
  namespaced: true,
  state: {
    accessToken: null,
    profile: null,
    type: "viewer",
    bookmarks: [],
    contributions: []
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
      const { accessToken, profile } = payload;
      try {
        if (accessToken) {
          const result = await Api.saveUser({ accessToken });
          const { type, bookmarks, contributions } = result.data;
          context.commit(SET_USER, {
            accessToken,
            profile,
            type,
            bookmarks,
            contributions
          });
        } else {
          const type = "viewer";
          context.commit(SET_USER, {
            accessToken: null,
            profile: null,
            type: "viewer",
            bookmarks: [],
            contributions: []
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    getUser: async context => {
      try {
        const { accessToken } = context.state;
        const { data } = await Api.getUser({ accessToken });
        const { bookmarks, contributions } = data;
        context.commit(SET_USER, { bookmarks, contributions });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
export default user;
