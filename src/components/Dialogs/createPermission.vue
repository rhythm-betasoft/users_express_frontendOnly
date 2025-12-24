<template>
    <v-dialog v-model="isVisible" max-width="600" persistent>
    <v-card>
        <v-card-title class="d-flex justify-center">
            Create New Permission
        </v-card-title>
        <v-card-text>
            <v-text-field variant="outlined" v-model="permission" label="Permissions"/>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="closePermissionDialog">Cancel</v-btn>
            <v-btn @click="submitForm">Create</v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script>
    export default{
        name:"createPermission",
        data(){
            return{
                isVisible:true,
                permission:''
            }
        },
        methods:{
            closePermissionDialog(data=null){
                this.$emit('closed',data);
            },
            submitForm(){
                this.$api.post('permission/add',{permission:this.permission})
                    .then(({data})=>{
                        this.$toast.show(data.message,'success')
                        this.closePermissionDialog(true);
                    })
                    .catch((err)=>{
                        this.$toast.show(err,'error')  
                })
            }
        }
    }
</script>