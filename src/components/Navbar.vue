<template>
    <v-app-bar color="#E8E1C6">
        <v-btn class="ml-5" :to="{ path: '/' }">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn :to="{ path: '/Profile' }">Profile</v-btn>
        <v-btn :to="{ path: '/EntireData' }">All Users</v-btn>
         <v-btn :to="{ path: '/SpendDetails' }">Spends</v-btn>


        <v-btn>
            <v-icon left>mdi-account </v-icon>
            <v-menu activator="parent">
                <v-list>
                    <v-list-item>
                       <h4> Hello {{ user.name }} !!</h4>
                    </v-list-item>
                    <v-list-item link :to="{ path: '/' }">
                        <v-list-item-title>
                            Sign Up/Login
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout()">
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
import { authStore } from '../store/authStore.js'

export default {
    name: "Navbar",
    computed: {
        user() {
            const store = authStore();
            return store.user;
        }
    },
    methods: {
        logout() {
            const store = authStore();
            store.logout();
            this.$router.push('/');
        }
    }
}
</script>
    