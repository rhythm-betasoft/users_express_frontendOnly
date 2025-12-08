<template>
  <v-dialog v-model="addmodalvalue" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h6 text-center">Enter OTP to Disable 2FA</v-card-title>
      <v-card-text>
        <v-otp-input v-model="otp" length="6" type="text" class="mt-4 mb-2" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" text @click="submitForm">Verify</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { inject } from 'vue'
import api from '@/plugins/api.js'
import { authStore } from "@/store/authStore.js";
export default {
  name: "OtpDialog",
  setup() {
    const toast = inject('toast');
    const store = authStore();
    return { toast, store };
  },
  data() {
    return {
      addmodalvalue: true, 
      otp: '' 
    };
  },
  methods: {
    closeDialog(data = null) {
      this.$emit('closed', data); 
    },
    submitForm() {
      api.put(`/user/2fa/${this.store.user.id}`, { flag: 0, code: this.otp })
        .then(({ data }) => {
          this.store.user.flag = false;
          this.toast.show(data.message, "success");
          this.otp = '';
          this.closeDialog(true);
        })
        .catch((error) => {
          this.toast.show(error,'error');
        });
    }
  }
};
</script>
