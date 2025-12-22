<template>
  <v-dialog v-model="isVisible" max-width="600" persistent>
    <v-card>
      <v-card-title>Add Leave</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="leave.leaveType"
          label="Leave Type"
        />

        <v-text-field
          v-model="leave.leaveDurationType"
          label="Duration Type (Full day / Half day)"
        />

        <v-text-field
          v-model="leave.startDate"
          label="Start Date"
          type="date"
        />

        <v-text-field
          v-model="leave.endDate"
          label="End Date"
          type="date"
        />

        <v-textarea
          v-model="leave.reason"
          label="Reason"
          rows="3"
        />
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
  data() {
    return {
      isVisible: true,

      leave: {
        leaveType: "",
        leaveDurationType: "",
        startDate: "",
        endDate: "",
        reason: ""
      }
    };
  },

  methods: {
    closeDialog(data = null) {
      this.$emit('closed', data);
    },

    submitForm() {
        this.$api.post("/leaves/apply", { leaveFormData: this.leave })
        .then(({ data }) => {
          this.$toast.show(data.message, "success");
          this.closeDialog();
        })
        .catch((error) => {
          this.$toast.show(error.response.data.message);
        });
    }
  }
};
</script>
