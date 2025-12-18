<template>
  <v-app-bar color="#E8E1C6" >
    <v-btn class="ml-5" :to="{ path: '/' }">UserBoard</v-btn>
    <v-spacer></v-spacer>
    <v-btn  v-if="store.user.role === roles.ADMIN" :to="{ path: '/users' }">Users</v-btn>
    <v-btn  v-if="store.user.role != roles.ADMIN":to="{ path: '/announcements' }">Announcements</v-btn>
    <v-btn v-if="store.user.role === roles.ADMIN"  :to="{ path: '/announcements/grid' }">Announcements</v-btn>
    <v-btn v-if="store.user.role === roles.ADMIN" :to="{ path: '/dashboard' }">Dashboard</v-btn>
    <v-btn>
      <v-icon left>mdi-account</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item>
            <h4>Hello {{ this.store.user.name}} !!</h4>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }">
            <v-list-item-title>Sign Up/Login</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item :to="{ path: '/profile' }">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { authStore } from '@/store/authStore.js'
import {roles} from '@/enums/roles'
export default {
  name: "Navbar",
  data() {
    return {
      store: authStore(),
      roles   
    }
  },
  methods: {
    logout() {
      this.store.logout()
      this.$router.push('/')
    },
  }
}
</script>
