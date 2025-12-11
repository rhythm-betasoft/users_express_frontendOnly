<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" md="9">
        <v-img src="https://www.cultureville.co.uk/cdn/shop/collections/IMG_1304.jpg?v=1691194840&width=750"
          height="100vh" width="100%" cover></v-img>
      </v-col>

      <v-col cols="12" md="3" class="d-flex align-center justify-center">
        <v-card flat class="pa-8" style="border-radius: 12px; width: 380px;">
          <div class="text-center mb-6">
            <div class="d-flex align-center justify-center mb-2">
              <v-avatar color="deep-orange lighten-5" class="mr-2"></v-avatar>
              <span class="font-weight-medium text-subtitle-1 black--text">Shopify</span>
            </div>
            <h1 v-if="flag" class="font-weight-bold mb-1 black--text">Welcome</h1>
            <p v-if="flag" class="caption grey--text">Please Signup to Continue</p>
            <h1 v-if="!flag" class="font-weight-bold mb-1 black--text">Welcome Back</h1>
            <p v-if="!flag" class="caption grey--text">Please Login to Continue</p>
          </div>
          <v-form @submit.prevent="!flag ? login() : register()">
            <v-text-field v-if="flag" label="Name" v-model="name"></v-text-field>
            <v-text-field label="Email" v-model="email" type="email"></v-text-field>
            <v-text-field label="Password" v-model="password" type="password"></v-text-field>
            <div v-if="flag">
              <v-text-field label="Confirm Password" v-model="confirm" type="password"></v-text-field>
            </div>
            <div v-if="!flag" class="text-right mb-4">
              <a href="#" class="deep-orange--text text-decoration-none text-caption">Forgot Password?</a>
            </div>
            <v-btn v-if="!flag" color="deep-orange accent-4" large block dark class="rounded-lg mb-6 text-capitalize"
              type="submit">
              Login
            </v-btn>
            <v-btn v-if="flag" color="deep-orange accent-4" large block dark class="rounded-lg mb-6 text-capitalize"
              type="submit">
              Signup
            </v-btn>
            <div class="divider my-6 d-flex align-center justify-center">
              <div class="divider-line"></div>
              <span class="mx-2 grey--text text-body-2">Or login/SignUp with</span>
              <div class="divider-line"></div>
            </div>
            <v-row dense>
              <v-col cols="6">
                <v-btn outlined block class="text-capitalize rounded-lg grey--text">
                  <v-icon left color="red">mdi-google</v-icon>
                  Google
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn outlined block class="text-capitalize rounded-lg grey--text">
                  <v-icon left color="blue darken-3">mdi-facebook</v-icon>
                  Facebook
                </v-btn>
              </v-col>
            </v-row>
            <div v-if="!flag" @click="toggleFlag"
              class="text-center mt-https://github.com/rhythm-betasoft/Authentication-express-typescript.git6 grey--text text-caption">
              Don’t have an account?
              <a href="#" @click="toggleFlag" class="deep-orange--text text-decoration-none">Signup</a>
            </div>
            <div v-if="flag" @click="toggleFlag" class="text-center mt-6 grey--text text-caption">
              Already have an account?
              <a href="#" @click="toggleFlag" class="deep-orange--text text-decoration-none">Login</a>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <TwoFA v-if="showTwoFaDialog" :user="store.user" @closed="closeTwoFaDialog" />
</template>

<script>
import { authStore } from '@/store/authStore'
import TwoFA from '@/components/Dialogs/TwoFA.vue';
const store = authStore()
export default {
  components: {
    TwoFA
  },
  data() {
    return {
      store,
      flag: false,
      name: '',
      email: '',
      password: '',
      confirm: '',
      showTwoFaDialog: false
    };
  },
  methods: {
    toggleFlag() {
      this.flag = !this.flag;
    },
    register() {
      this.$api.post('/user/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        confirm: this.confirm,
      })
        .then(({ data }) => {
          const { accesstoken, refreshtoken, user } = data;
          const store = authStore();
          store.setAuth(accesstoken, refreshtoken, user);
          this.toggleFlag();
          this.$toast.show(data.message, 'success');
        })
        .catch((error) => {
          this.$toast.show(error, "error");
        });
    },
    login() {
      this.$api.post('/user/login', {
        email: this.email,
        password: this.password,
      })
        .then(({ data }) => {
          const { message, accesstoken, refreshtoken, user } = data;
          const store = authStore();
          store.setUser(user);
          if (message?.includes("2FA setup required") || message?.includes("2FA verification required")) {
            this.openTwoFaDialog();
            return;
          }
          store.setAuth(accesstoken, refreshtoken, user);
          this.$toast.show(data.message, "success");
          this.$router.push("/profile");
        })
        .catch((error) => {
          this.$toast.show(error, "error");
        });
    }
    ,
    closeTwoFaDialog() {
      this.showTwoFaDialog = false;
    },
    openTwoFaDialog() {
      this.showTwoFaDialog = true;
    },

  }
}
</script>