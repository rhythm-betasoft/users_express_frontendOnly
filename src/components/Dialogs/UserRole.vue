<template>
    <v-dialog v-model="isVisible" max-width="600" persistent>
        <v-card>
            <v-card-title>Users Role</v-card-title>
            <v-select class="mx-4" v-model="role" label="Role" :items="roleTypes"></v-select>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="submitRole">Submit</v-btn>
                <v-btn @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { roles } from '@/enums/roles'
export default {
    props: {
        id: { type: Number, required: true }
    },
    data() {
        return {
            role: '',
            isVisible: true,
            roleTypes: [roles.USER, roles.ADMIN, roles.HR, roles.MANAGER]
        }
    },
    methods: {
        submitRole() {
            this.$api.patch("/user/update/role", {
                userid: this.id,
                role: this.role
            })
                .then(()=> {
                    this.closeDialog()
                })
                .catch(err => {
                    this.$toast.show(err,'error')
                    this.closeDialog()
                });
        },
        closeDialog(data = null) {
            this.$emit('closed', data)
        }
    }
}
</script>