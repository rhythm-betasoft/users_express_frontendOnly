<template>
  <v-container class="d-flex align-center justify-center mt-5"
    style="background-color: #F4F6F8; width: 100%; max-width: 1400px; padding-bottom: 30px;">
    <h1 v-if="!isProfileComplete" class="text-center" style="font-size: 36px; color: #2C3E50;">Complete Your Profile</h1>
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
            <v-form v-model="valid">
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

                 <!-- <v-col cols="12" sm="6">
                  <v-text-field v-model="formData.religion" label="DOB"  outlined dense />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="formData.blood_group" label="State"  outlined
                    dense />
                </v-col> -->
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
      </v-col>
    </v-row>
  </v-container>

  <v-footer app class="text-center" style="background-color: #F4F6F8; padding: 20px;">
    <v-container>
      <span style="font-size: 14px; color: #7F8C8D;">© 2025 YourCompany. All rights reserved.</span>
    </v-container>
  </v-footer>
</template>

<script>
import axios from "axios";
import { authStore } from "../store/authStore.js";
import api from '../plugins/api.js'
export default {
  data() {
    return {
      store: authStore(),
      valid: false,
      formData: {
        age: "",
        gender: "",
        religion: "",
        blood_group: "",
      },
      rules: {
        required: (value) => !!value || "This field is required.",
      },
    };
  },
  computed: {
    isProfileComplete() {
      const { age, gender, religion, blood_group } = this.store.user;
      return age && gender && religion && blood_group;
    },
  },
  methods: {
    async submitForm() {
      // if (!this.formData.age || !this.formData.gender || !this.formData.religion || !this.formData.blood_group) {
      //   alert("All fields are required!");
      //   return;
      // }

      this.formData.age = Number(this.formData.age);

      try {
        const response = await api.put(`/users/profile/${this.store.user.id}`, this.formData);
        console.log("Profile updated successfully:", response.data);
        this.store.user = { ...this.store.user, ...this.formData };
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error:", error); 
        console.error("Error response:", error.response);  
        alert("Failed to update profile. Please try again.");
      }

    },
  },
  mounted() {
    this.formData.age = this.store.user.age || "";
    this.formData.gender = this.store.user.gender || "";
    this.formData.religion = this.store.user.religion || "";
    this.formData.blood_group = this.store.user.blood_group || "";
  },
};
</script>
