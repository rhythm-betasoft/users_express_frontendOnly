<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh; background-color: #f4f7fc;">
    <v-card class="pa-6" max-width="400" outlined>
      <v-card-title class="text-center">
        <h2 class="mb-4">Two-Factor Authentication</h2>
      </v-card-title>
      <v-card-subtitle class="text-center mb-4">
        Please enter the OTP generated via authenticator.
      </v-card-subtitle>
      <v-img v-if="qr" :src="qr" max-width="200" class="mx-auto mb-6" />
      <v-text-field v-model="otp" label="Enter OTP" type="text" outlined dense autofocus @keydown.enter="verifyOTP" />
      <v-btn color="primary" @click="verifyOTP" block class="mt-4">
        Verify OTP
      </v-btn>
      <div class="d-flex justify-end mt-2">
        <span @click="requestOTPviaEmail" class="text-link"
          style="cursor: pointer; color: #1976D2; text-decoration: underline;">
          Request OTP via Email
        </span>
      </div>
      <v-checkbox v-model="rememberDevice" label="Remember this device " />

    </v-card>
  </v-container>
</template>

<script>
import api from '@/plugins/api';
import { authStore } from '@/store/authStore';
import {inject} from 'vue'
export default {
   setup() {
    const toast = inject('toast');
    return { toast };
  },
  data() {
    return {
      otp: '',
      qr: this.$route.query.qr || '',
      userId: this.$route.query.userId,
      rememberDevice: false
    };
  },
  methods: {
    verifyOTP() {
      api.post('/user/verify-twofa', {
        userId: this.userId,
        code: this.otp,
        rememberDevice: this.rememberDevice
      })
        .then(({data}) => {
          const { accesstoken, refreshtoken, user } = data;
          const store = authStore();
          store.setAuth(accesstoken, refreshtoken, user);
         this.toast.show(data.message,'success')
          this.$router.push('/profile');
        })
        .catch(error => {
          this.toast.show(error,'error')
        });
    },

    requestOTPviaEmail() {
      api.post(`/user/otpOnMail/${this.userId}`)
        .then(({data}) => {
          this.toast.show(data.message,'success')
        })
        .catch(error => {
         this.toast.show(error,'error')
        });
    }

  }
};
</script>
