<template>
    <v-dialog v-model="showDialog" max-width="400" persistent>
        <v-card class="pa-6" outlined>
            <v-card-title class="text-center">
                <h2 class="mb-4">Two-Factor Authentication</h2>
            </v-card-title>
            <v-card-subtitle class="text-center mb-4">
                Please enter the OTP generated via authenticator.
            </v-card-subtitle>

            <v-img v-if="qr" :src="qr" max-width="200" class="mx-auto mb-6" />

            <v-text-field v-model="otp" label="Enter OTP" type="text" outlined dense @keydown.enter="verifyOTP" />
            <v-btn color="primary" @click="verifyOTP" block class="mt-4">
                Verify OTP
            </v-btn>
            <div class="d-flex justify-end mt-2">
                <span @click="requestOTPviaEmail" class="text-link"
                    style="cursor: pointer;text-decoration: underline;">
                    Request OTP via Email
                </span>
            </div>
            <v-checkbox v-model="rememberDevice" label="Remember this device" />
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { authStore } from '@/store/authStore';
export default {
    name: "TwoFactorDialog",
    data() {
        return {
            showDialog: true,
            otp: '',
            qr: this.$route.query.qr || '',
            userId: this.$route.query.userId,
            rememberDevice: false
        };
    },
    
    methods: {
        closeDialog(data = null) {
            this.showDialog = false;
        },
        verifyOTP() {
            this.$api.post('/user/verify-twofa', {
                userId: this.userId,
                code: this.otp,
                rememberDevice: this.rememberDevice
            })
                .then(({ data }) => {
                    const { accesstoken, refreshtoken, user } = data;
                    const store = authStore();  
                    store.setAuth(accesstoken, refreshtoken, user);
                    this.$toast.show(data.message, 'success');
                    this.$router.push('/profile');
                    this.closeDialog(true);
                })
                .catch(error => {
                    this.$toast.show(error, 'error');
                });
        },
        requestOTPviaEmail() {
            this.$api.post(`/user/otp-on-mail/${this.userId}`)
                .then(({ data }) => {
                    this.$toast.show(data.message, 'success');
                })
                .catch(error => {
                    this.$toast.show(error, 'error');
                });
        }
    }
};
</script>
