import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    backendAccessible: false, // set this to true when backend will actually be implemented
    rpc: null, // pointer to RPC handler
    tracker: null, // pointer to tracking handler
    session: null,  // pointer to Session handler
    user: { loggedIn: null, username: null }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
});
