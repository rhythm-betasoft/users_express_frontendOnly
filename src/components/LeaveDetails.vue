<template>
  <v-card>
    <v-card-text>
       <p><strong>Reason:</strong> {{ leave.leaveType }}</p>
       <p><strong>Status:</strong> {{ leave.status }}</p>
    </v-card-text>
   
    <v-card-actions class="d-flex justify-end">
      <v-btn @click="approveLeave" color="primary">Approve</v-btn>
      <v-btn color="red" @click="openLeaveDisapproveDialog" >Disapprove</v-btn>
    </v-card-actions>
  </v-card>
  <leave-disapprove v-if="leaveDisapproveDialog" :id="leave.id" @closed="closeLeaveDisappproveDialog" @updated="$emit('updated')" />
</template>
<script>
  import {defineAsyncComponent} from 'vue'
    const LeaveDisapprove=defineAsyncComponent(()=>('../components/Dialogs/LeaveDisapprove.vue'))
export default {
  name: "LeaveDetail",
  components: {
    LeaveDisapprove
  },
  props: {
    leave: { type: Object, required: true },
  },
  data() {
    return {
      leaveDisapproveDialog: false,
    };
  },
  methods: {
    approveLeave() {
      this.$api
        .post("leaves/approve", {
          leaveId: this.leave.id,
        })
        .then(({ data }) => {
          this.$toast.show(data.message,'success');
          this.closeLeaveDisappproveDialog();
          this.$emit("updated")
        })
        .catch((err) => this.toast.show(err, "error"));
    },
    openLeaveDisapproveDialog(){
        this.leaveDisapproveDialog=true;
    },
    closeLeaveDisappproveDialog(){
        this.leaveDisapproveDialog=false;
    }
    
  },
};
</script>

