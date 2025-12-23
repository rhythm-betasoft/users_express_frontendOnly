<template>
  <v-dialog v-model="isVisible" max-width="600" persistent>
    <v-card>
      <v-card-title>Apply Leave</v-card-title>
      <v-card-text>
        <v-text-field v-model="leave.leaveType" label="Leave Type" />
        <v-select v-model="leave.leaveDurationType" :items="['Full day', 'Half day', 'Short leave']"
          label="Duration Type" />
        <v-row>
          <v-col cols="6">
            <div class="text-subtitle-1 mb-2">Start Date</div>
            <VueDatePicker v-model="leave.startDate" format="dd-MM-yyyy" value-as-date auto-apply :min-date="minDate" />
          </v-col>
          <v-col cols="6">
            <div class="text-subtitle-1 mb-2">End Date</div>
            <VueDatePicker v-model="leave.endDate" format="dd-MM-yyyy" value-as-date auto-apply :min-date="minDate" />
          </v-col>
        </v-row>
        <v-textarea v-model="leave.reason" label="Reason" rows="3" class="mt-5" />
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
import { VueDatePicker } from '@vuepic/vue-datepicker'
export default {
  components: { VueDatePicker },
  data() {
    return {
      isVisible: true,
      leave: {
        leaveType: "",
        leaveDurationType: "",
        startDate: null,
        endDate: null,
        reason: ""
      },
      minDate: new Date()
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
