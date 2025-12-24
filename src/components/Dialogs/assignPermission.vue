<template>
    <v-dialog v-model="isVisible" max-width="350">
  <v-card elevation="10">
    <v-card-title class="d-flex justify-center text-h6 font-weight-bold pt-4 pb-2">
      Assign Permissions
    </v-card-title>
    
    <v-divider></v-divider>
    <div class="pa-4"> 
      <div v-for="permission in this.arr" :key="permission.id">
        <v-checkbox  v-model="permissions"  :label="permission.permission" :value="permission.id"
          density="compact" hide-details class="my-1"></v-checkbox>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn @click="closeAssignPermissionDialog" color="grey-darken-1" variant="text">
        Cancel
      </v-btn>
      <v-btn @click="assignPermissions" color="primary" variant="elevated"> Assign</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
export default {
    name: "assignPermission",
    props:{
        id:{type:Number,required:true}
    },
    data() {
        return {
            isVisible: true,
            arr: [],
            permissions: []
        }
    },
    mounted() {
        this.fetchPermissions()
    },
    methods: {
        closeAssignPermissionDialog(data = null) {
            this.$emit('closed', data)
        },
        fetchPermissions() {
            this.$api.get('/permission/list')
                .then(({ data }) => {
                    this.arr = data.data
                })
        },
        assignPermissions() {
            this.$api.put('/permission/update',
                {
                    userid: this.id,
                    permissions: this.permissions
                })
                .then(({ data }) => {
                    this.$toast.show(data.message,'success')
            })
            .catch((err)=>this.$toast.show(err,'error'))
}
    }
}
</script>