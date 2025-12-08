<template>
  <v-container class="d-flex align-center justify-center mt-5"
    style="background-color: #F4F6F8; width: 100%; max-width: 1400px; padding-bottom: 30px;">
    <h1 v-if="!isProfileComplete" class="text-center" style="font-size: 36px; color: #2C3E50;">Complete Your Profile
    </h1>
    <h1 v-if="isProfileComplete" class="text-center" style="font-size: 36px; color: #2C3E50;">Your Details</h1>
  </v-container>

  <v-container fluid class="py-10" style="margin-top: 30px;">
    <v-row>
      <v-col cols="12" md="4" class="d-flex justify-center">
        <v-card class="elevation-3 profile-card" width="300px" style="background-color: #FFFFFF;">
          <v-img
            src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
            height="250px" alt="Profile Image" class="rounded-circle profile-img"></v-img>
          <v-divider class="my-2"></v-divider>
          <v-card-title class="profile-name">{{ store.user.name }}</v-card-title>
          <v-card-subtitle class="profile-role">{{ store.user.role }}</v-card-subtitle>
          <v-card-subtitle class="profile-id">Id: {{ store.user.id }}</v-card-subtitle>
          <v-card-subtitle class="profile-email">{{ store.user.email }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" v-if="!isProfileComplete">
        <v-card class="elevation-3" style="max-width: 900px; background-color: #FFFFFF;">
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="formData.age" label="Age" type="number" :rules="[rules.required]" outlined
                    dense />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="formData.gender" label="Gender" :items="['Male', 'Female', 'Other']"
                    :rules="[rules.required]" outlined dense />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="formData.religion" label="Religion" :rules="[rules.required]" outlined dense />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="formData.blood_group" label="Blood Group" :rules="[rules.required]" outlined
                    dense />
                </v-col>
              </v-row>
              <v-container class="d-flex justify-center align-center" style="height: 100px;">
                <v-btn color="primary" @click="submitForm" class="save-btn"
                  style="font-weight: bold; padding: 12px 24px;">
                  Save
                </v-btn>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card class="mt-5 pa-4" style="background-color: #FAFAFA; max-width: 600px;">
          <v-card-text>
            <v-row align="center">
              <v-col cols="8">
                <span class="text-body-1 font-weight-medium">Enable Two-Factor Authentication</span>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-switch v-model="switchState" inset color="success" @change="toggle2FA" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8" v-else>
        <v-card elevation="3" class="pa-4" style="max-width: 1000px;">
          <v-card-title class="text-h6 font-weight-medium">
            User Information
          </v-card-title>
          <v-divider class="mb-3"></v-divider>
          <v-card-text class="text-body-2">
            <v-row dense>
              <v-col cols="6" class="font-weight-medium text-secondary">Role:</v-col>
              <v-col cols="6">{{ store.user.role }}</v-col>
              <v-col cols="6" class="font-weight-medium text-secondary">Age:</v-col>
              <v-col cols="6">{{ store.user.age }}</v-col>
              <v-col cols="6" class="font-weight-medium text-secondary">Gender:</v-col>
              <v-col cols="6">{{ store.user.gender }}</v-col>
              <v-col cols="6" class="font-weight-medium text-secondary">Religion:</v-col>
              <v-col cols="6">{{ store.user.religion }}</v-col>
              <v-col cols="6" class="font-weight-medium text-secondary">Blood Group:</v-col>
              <v-col cols="6">{{ store.user.blood_group }}</v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-5 pa-4" style="background-color: #FAFAFA; max-width: 600px;">
          <v-card-text>
            <v-row align="center">
              <v-col cols="8">
                <span class="text-body-1 font-weight-medium">Enable Two-Factor Authentication</span>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-switch v-model="switchState" inset color="success" @change="toggle2FA" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-footer app class="text-center" style="background-color: #F4F6F8; padding: 20px;">
    <v-container>
      <span style="font-size: 14px; color: #7F8C8D;">© 2025 Betasoft Solutions. All rights reserved.</span>
    </v-container>
  </v-footer>
  <OtpDialog v-if="showOTPDialog" @closed="closeOtpDialog" />
</template>
<script>
import { authStore } from "../store/authStore.js";
import api from '../plugins/api.js'
import { inject } from 'vue'
import OtpDialog from '../components/Dialogs/OtpDialog.vue'
export default {
  components: {
    OtpDialog
  },
  setup() {
    const toast = inject('toast');
    return { toast };
  },
  data() {
    const store = authStore();
    return {
      store,
      twoFactorEnabled: Boolean(store.user.flag),
      formData: {
        age: store.user.age || "",
        gender: store.user.gender || "",
        religion: store.user.religion || "",
        blood_group: store.user.blood_group || "",
      },
      rules: {
        required: (value) => !!value || "This field is required.",
      },
      showOTPDialog: false,
      switchState: Boolean(store.user.flag),
    };
  }
  ,
  computed: {
    isProfileComplete() {
      const { age, gender, religion, blood_group } = this.store.user;
      return age && gender && religion && blood_group;
    },
  },
  methods: {
    submitForm() {
      this.formData.age = Number(this.formData.age);
      api.put(`/user/profile/${this.store.user.id}`, this.formData)
        .then(({ data }) => {
          this.store.user = { ...this.store.user, ...this.formData };
          this.toast.show(data.message, "success");
        })
        .catch((error) => {
          this.toast.show(error, "error");
        });
    },
    toggle2FA() {
      const flag = this.switchState ? 1 : 0;
      if (flag === 0) {
        this.openOtpDialog();
        return;
      }
      api.put(`/user/2fa/${this.store.user.id}`, { flag })
        .then(() => {
          return api.post('/user/switchOnTwoFA', { userId: this.store.user.id });
        })
        .then(({ data }) => {
          const { qr, userId } = data;
          this.$router.push({ name: 'two-fa', query: { qr, userId } });
          this.store.user.flag = true;
          this.twoFactorEnabled = true;
          this.switchState = true;
          this.toast.show(data.message, "success");
        })
        .catch((error) => {
          this.switchState = false;
          this.toast.show(error, "error");
        });
    },
    closeOtpDialog() {
      this.showOTPDialog = false;
      this.switchState = true;
    },
    openOtpDialog() {
      this.showOTPDialog = true;
    },
  }
};
</script>