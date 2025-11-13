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
      <v-text-field  v-model="otp"   label="Enter OTP"   type="text"  outlined  dense autofocus @keydown.enter="verifyOTP"/>
      <v-btn  color="primary"  @click="verifyOTP"  block  class="mt-4">
        Verify OTP
      </v-btn>
      <div class="d-flex justify-end mt-2">
        <span 
          @click="requestOTPviaEmail" 
          class="text-link"
          style="cursor: pointer; color: #1976D2; text-decoration: underline;">
          Request OTP via Email
        </span>
      </div>
      <v-checkbox v-model="rememberDevice" label="Remember this device " />

    </v-card>
  </v-container>
</template>

<script>
import api from '../plugins/api';
import { authStore } from '../store/authStore';
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      otp: '',
      qr: this.$route.query.qr || '',
      userId: this.$route.query.userId,
      rememberDevice: false
    };
  },
  methods: {
    async verifyOTP() {
      try {
        const response = await api.post('/users/verify-twofa', {
          userId: this.userId,
          code: this.otp,
          rememberDevice: this.rememberDevice
        });

        const { accesstoken, refreshtoken, user } = response.data;
        const store = authStore();
        store.setAuth(accesstoken, refreshtoken, user);
        toast.success("2FA verified!");
        this.$router.push('/profile');
      } catch (error) { 
        toast.error("Invalid OTP. Try again.");
      }
    },

    async requestOTPviaEmail(){
      try{
        await api.post(`/users/otpOnMail/${this.userId}`)
        toast.success("otp sent on mail .")
      }
      catch(error){
        console.log("error sending one time password",error)
      }
    }
  }
};
</script>
