<template>
    <v-dialog v-model="isVisible" max-width="600">
        <v-card>
            <v-card-title>Reason for disapprove</v-card-title>
            <v-card-text>
                <v-textarea v-model="reason" label="reason" />
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
                <v-btn @click="submitDisapprove">Submit</v-btn>
                <v-btn @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: "LeaveDisapprove",
    props: {
        id: { type: Number, required: true }
    },
    data() {
        return {
            isVisible: true,
            reason: ''
        }
    },
    methods: {
        closeDialog(data = null) {
            this.$emit('closed', data)
        },
        submitDisapprove() {
            this.$api.post("/leaves/disapprove", {
                leaveId: this.id,
                rejectionReason: this.reason
            })
                .then(({ data }) => {
                    if (data.status) {
                        this.$toast.show(data.message, 'success')
                        this.$emit("updated")
                        this.closeDialog();
                    }
                    else {
                        this.$toast.show(data.message, 'error')
                        this.closeDialog();
                    }
                })
                .catch((err) => {
                    this.$toast.show(err,'error')
                    this.closeDialog();
                });
        }

    }
}
</script>