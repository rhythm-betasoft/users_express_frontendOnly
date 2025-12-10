<template>
  <v-dialog v-model="addmodalvalue" max-width="600px" persistent>
    <v-card>
      <v-card-title>Create New Announcement</v-card-title>
      <v-card-text>
        <v-text-field v-model="announcement.title" label="Title" />
        <v-textarea v-model="announcement.content" label="Content" rows="4" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" text @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name:"AddAnnouncementDialog",
  data() {
    return {
      addmodalvalue: true,
      announcement: {
        title: '',
        content: ''
      }
    };
  },
  methods: {
    closeDialog(data = null) {
      this.$emit('closed', data);
    },
    submitForm() {
      this.$api.post('/announcements/add', this.announcement)
        .then(({ data }) => {
          this.$toast.show(data.message, 'success');
          this.closeDialog(true);
        })
        .catch((error) => {
          this.$toast.show(error, 'error');
        })
    }
  }
};
</script>