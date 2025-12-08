<template>
  <v-app>
    <Navbar v-if="isLoggedIn" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script >
import Navbar from './components/Navbar.vue';
import { authStore } from './store/authStore'; 
import swalToast from './composables/toast';
import Utils from './composables/utils'
const toastService=new swalToast();
const utils=new Utils();
export default {
  components: {
    Navbar
  },
 provide() {
    return {
      toast: toastService,
      utils
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
