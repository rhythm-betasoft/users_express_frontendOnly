<template>
  <v-app>
    <Navbar v-if="isLoggedIn" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { authStore } from '@/store/authStore'; 
import swalToast from '@/utils/toast.js';
const toastService=new swalToast();
export default {
  components: {
    Navbar
  },
   provide() {
    return {
      toast: toastService,
    };
  },
  computed: {
    isLoggedIn() {
      const store = authStore();
      return store.isLoggedIn(); 
    }
  }
}
</script>
