<template>
    <v-dialog v-model="isVisible" max-width="400" persistent>
        <v-card class="pa-6" outlined>
            <v-card-title class="text-center">
                <h2 class="mb-4">Two-Factor Authentication</h2>
            </v-card-title>
            <v-card-subtitle class="text-center mb-4">
                Please enter the OTP generated via authenticator.
            </v-card-subtitle>
            <img v-if="qr" :src="qr" style="max-width:200px; display:block; margin:auto;" />
            <v-text-field v-model="otp" label="Enter OTP" type="text" outlined dense @keydown.enter="verifyOTP" />
            <v-btn color="primary" @click="verifyOTP" block class="mt-4">
                Verify OTP
            </v-btn>
            <div class="d-flex justify-end mt-2">
                <span @click="requestOTPviaEmail" class="text-link" style="cursor: pointer;text-decoration: underline;">
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
            isVisible: true,
            otp: '',
            qr: '',
            rememberDevice: false,
            store: authStore()
        };
    },
    mounted() {
        this.openDialog();
    },
    methods: {
        openDialog() {
            this.isVisible = true;
            this.enableTwoFA();
        },
        enableTwoFA() {
            this.$api.post(`/user/switch-on-twofa`, { userId: this.store.user.id })
                .then(({ data }) => {
                    this.qr = data.qr;
                })
                .catch(error => {
                    this.$toast.show(error, 'error');
                });
        },
        closeDialog() {
            this.isVisible = false;
        },
        verifyOTP() {
            this.$api.post('/user/verify-twofa', {
                userId: this.store.user.id,
                code: this.otp,
                rememberDevice: this.rememberDevice
            })
                .then(({ data }) => {
                    const { accesstoken, refreshtoken, user } = data;
                    this.store.setAuth(accesstoken, refreshtoken, user);
                    this.$toast.show(data.message, 'success');
                    this.$router.push('/profile');
                    this.closeDialog();
                })
                .catch(error => {
                    this.$toast.show(error, 'error');
                });
        },
        requestOTPviaEmail() {
            this.$api.post(`/user/otp-on-mail/${this.store.user.id}`)
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
