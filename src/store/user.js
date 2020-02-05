import axios from 'axios';
import setAuthToken from '@/utils/setAuthToken';
import router from '@/router';

let signoutTimeout = null;
let refreshAuthInterval = null;

export default {
  state: {
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    loadingUserData: false
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    setRefreshToken(state, payload) {
      state.refreshToken = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setLoadingUserData(state, payload) {
      state.loadingUserData = payload;
    }
  },
  actions: {
    async signinUser({ commit, dispatch }, payload) {
      try {
        commit('setLoading', true);
        commit('setError', null);
        const response = await axios.post('/api/signin', payload);
        const { token, refresh_token } = response.data;
        dispatch('autoSigninUser', {
          token,
          refresh_token
        });
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data);
        console.log(error.response.data);
      }
    },
    async signupUser({ commit, dispatch }, payload) {
      try {
        commit('setLoading', true);
        commit('setError', null);
        const response = await axios.post('/api/signup', payload);
        const { token, refresh_token } = response.data;
        dispatch('autoSigninUser', {
          token,
          refresh_token
        });
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data);
        console.log(error.response.data);
      }
    },
    autoSigninUser({ commit, dispatch }, payload = {}) {
      let { token, refresh_token } = payload;
      if (token) {
        commit('setToken', token);
        commit('setRefreshToken', refresh_token);
        localStorage.setItem('token', token);
        localStorage.setItem('refresh_token', refresh_token);
        setAuthToken(token);
        dispatch('getUser');
      } else {
        token = localStorage.getItem('token');
        refresh_token = localStorage.getItem('refresh_token');
        if (token) {
          commit('setToken', token);
          commit('setRefreshToken', refresh_token);
          setAuthToken(token);
          dispatch('getUser');
        } else {
          commit('setLoadingUserData', false);
        }
      }
    },

    async getUser({ commit, dispatch }) {
      try {
        const userResponse = await axios.get('/api/get-user');
        commit('setUser', userResponse.data);
        dispatch('setSignoutTimer', userResponse.data.exp);
        router.push('/');
        commit('setLoading', false);
        setTimeout(() => {
          commit('setLoadingUserData', false);
        }, 5000);
      } catch (error) {
        commit('setLoading', false);
        setTimeout(() => {
          commit('setLoadingUserData', false);
        }, 5000);
        const data = error.response.data;
        if (data.message === 'Unauthorized') {
          dispatch('signoutUser');
        }
      }
    },

    setSignoutTimer({ commit, dispatch }, time) {
      const timeout = time - Date.now() / 1000;
      if (signoutTimeout) {
        clearTimeout(signoutTimeout);
      }
      signoutTimeout = setTimeout(() => {
        dispatch('signoutUser');
      }, timeout * 1000);
      dispatch('setRefreshAuthTime', timeout);
    },

    signoutUser({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      commit('setToken', null);
      commit('setRefreshToken', null);
      commit('setUser', null);
      setAuthToken(null);
      clearTimeout(signoutTimeout);
      clearInterval(refreshAuthInterval);
    },

    setRefreshAuthTime({ commit, dispatch }, timeout) {
      let refreshTime = timeout - 300;
      if (refreshAuthInterval) {
        clearInterval(refreshAuthInterval);
      }
      refreshAuthInterval = setInterval(() => {
        dispatch('refreshAuth');
      }, refreshTime * 1000);
    },

    async refreshAuth({ commit, getters, dispatch }) {
      try {
        const refreshToken = getters.getRefreshToken;
        const response = await axios.post('/api/refresh-auth', {
          refreshToken
        });
        const { token, refresh_token } = response.data;
        dispatch('autoSigninUser', {
          token,
          refresh_token
        });
      } catch (error) {
        console.log(error);
        console.log(error.response.data);
      }
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getToken(state) {
      return state.token;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
    getLoading(state) {
      return state.loading;
    },
    getLoadingUserData(state) {
      return state.loadingUserData;
    }
  }
};
