<template>
  <v-dialog v-model="addmodalvalue" max-width="600" persistent>
    <v-card>
      <v-card-title>Add New User</v-card-title>
      <v-card-text>
        <v-text-field v-model="user.name" label="Name" />
        <v-text-field v-model="user.email" label="Email" />
        <v-text-field v-model="user.password" label="Password" type="password" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" text @click="submitForm">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
 
<script>
export default {
  name: "AddUserDialog",
  data() {
    return {
      addmodalvalue:true,
      user: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    closeDialog(data = null) {
      this.$emit('closed', data);
    },
    submitForm() {
      this.$api.post('/user/register', this.user)
        .then(({data}) => {
          this.$toast.show(data.message,'success')
          this.closeDialog(true);
        })
        .catch((error) => {
          this.$toast.show(error, 'error');
        })
    }
  }
};
</script>