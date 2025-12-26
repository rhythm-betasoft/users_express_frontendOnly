<template>
    <v-container>

        <v-card-title class="d-flex justify-center">Select user to see/mark attendance</v-card-title>

        <div class="d-flex justify-center mx-auto mt-5" style="max-width: 500px;">
            <v-select :items="allUsers" item-title="name" item-value="id" label="Select User" v-model="selectedUserId"
                @update:model-value="openAttendanceDialog" variant="outlined" density="compact"  />
        </div>


        <AttendanceDetail v-if="attendanceModalValue" :user-id="selectedUserId" :month="selectedMonth"
            :year="selectedYear" @closed="closeAttendanceDialog" />

    </v-container>
</template>

<script>
import AttendanceDetail from '@/components/Dialogs/AttendanceDetail.vue'
export default {
    components: {
        AttendanceDetail
    },
    data() {
        return {
            selectedUserId: '',
            selectedMonth: new Date().getMonth() + 1,
            selectedYear: new Date().getFullYear(),
            attendanceModalValue: false,
            allUsers: []
        }
    },
    mounted() {
        this.fetchUsers()
    },
    methods: {
        fetchUsers() {
            this.$api.get('/attendance/users/list')
                .then(({ data }) => {
                    this.allUsers = data
                })
        },
        openAttendanceDialog() {
            this.attendanceModalValue = true;
        },
        closeAttendanceDialog() {
            this.attendanceModalValue = false;
        }
    }
}

</script>