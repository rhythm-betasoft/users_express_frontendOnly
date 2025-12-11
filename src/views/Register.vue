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
                        <v-btn v-if="!flag" color="deep-orange accent-4" large block dark
                            class="rounded-lg mb-6 text-capitalize" type="submit">
                            Login
                        </v-btn>
                        <v-btn v-if="flag" color="deep-orange accent-4" large block dark
                            class="rounded-lg mb-6 text-capitalize" type="submit">
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
</template>

<script >
import api from '../plugins/api.js'
import { authStore } from '../store/authStore'
import { toast } from 'vue3-toastify';
export default {
    data() {
        return {
            flag: false,
            name: '',
            email: '',
            password: '',
            confirm: '',
        };
    },
    methods: {
        toggleFlag() {
            this.flag = !this.flag;
        },

        async register() {
            if (this.password !== this.confirm) {
                toast.error("Passwords do not match");
                return;
            }

            try {
                const response = await api.post('/users/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    confirm: this.confirm,
                });

                const { accesstoken, refreshtoken, user } = response.data;
                if (!user) { toast.error("User not found"); throw new Error("User data is missing in the response."); }
                const store = authStore();
                store.setAuth(accesstoken, refreshtoken, user);

                if (accesstoken && refreshtoken) {
                    console.log('access Token:', accesstoken);
                    console.log('refresh Token:', refreshtoken);
                } else {
                    console.error('Tokens not found in registration response');
                }

                toast.success("Registration successful!");
                this.toggleFlag();

            } catch (error) {
                console.error("Registration error:", error);
                const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
                toast.error(errorMessage);
            }
        },

    async login() {
  try {
    const response = await api.post('/users/login', {
      email: this.email,
      password: this.password,
    });
    const { message, accesstoken, refreshtoken, user, qr, otpauthUrl } = response.data;
    const store = authStore();
    if (message?.includes("2FA setup required") || message?.includes("2FA verification required")) {
      this.$router.push({
        path: '/TwoFA',
        query: {
          qr: qr || '',
          otpauthUrl: otpauthUrl || '',
          userId: user.id
        }
      });
      return;
    }
    store.setAuth(accesstoken, refreshtoken, user);

    if (accesstoken && refreshtoken) {
      console.log('Access Token:', accesstoken);
      console.log('Refresh Token:', refreshtoken);
    } else {
      console.error('Tokens not found in response data');
    }

    toast.success("Login successful!");
    this.$router.push('/profile');

  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error.response?.data?.message || "Login failed.";
    toast.error(errorMessage);
  }
}

    }
};
</script>
