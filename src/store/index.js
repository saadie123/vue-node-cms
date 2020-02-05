import Vue from 'vue';
import Vuex from 'vuex';

import userModule from './user';
import sharedModule from './shared';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: userModule,
    shared: sharedModule
  }
});
