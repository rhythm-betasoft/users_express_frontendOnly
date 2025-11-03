import { defineStore } from 'pinia';
import * as jwt_decode from 'jwt-decode'; 

export const authStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    user: null,
  }),
  actions: {
    setAuth(accessToken, refreshToken, user) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.user = user;
    },
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.user = null;
    },
    isLoggedIn() {
      return !!this.accessToken;
    },
    decodeToken() {
      try {
        if (this.accessToken) {
          return jwt_decode.decode(this.accessToken); 
        }
        return null;
      } 
      catch (error) {
        return null;
      }
    },
    userRole() {
      const decoded = this.decodeToken();
      if (decoded) {
        this.user = { ...this.user, role: decoded.role }; 
      }
    },
  },
  persist: true,
});
