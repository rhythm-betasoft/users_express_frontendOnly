<template>
    <v-dialog v-model="isVisible" max-height="800" max-width="500" persistent>
        <v-card>
            <FullCalendar :options="calendarOptions" />
            <v-btn @click="closeDialog">Close</v-btn>
        </v-card>
    </v-dialog>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {authStore} from '@/store/authStore'
import {roles} from '@/enums/roles'
export default {
    name: "AttendanceDetail",
    components: { FullCalendar,roles },
    props: {
        userId: String,
        month: Number,
        year:Number
    },
    data() {
        return {
            isVisible: true,
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                weekends: false,
                // initialView: 'dayGridMonth',
                events: [],
                dateClick:this.handleDateClick
            },
            store:authStore()
        }
    },
    mounted() {
        this.loadAttendance()
    },
    methods: {
       loadAttendance() {
            this.$api.get('/attendance/list', {
                params: {
                    userId: this.userId,
                    month: this.month,
                    year: this.year
                }
            })
                .then(({ data }) => {
                    this.calendarOptions.events = data.events
                })
                .catch((err) => this.$toast.show(err, 'error'))
        },
        closeDialog(data = null) {
            this.isVisible = false
            this.$emit('closed', data)
        },
        handleDateClick(arg){
            this.markattendance(arg)
        },
        markattendance(arg){
            const attendanceStatus="present"
            this.$api.post("/attendance/mark",{userId:this.userId,date:arg.dateStr,status:attendanceStatus})
            .then(({data})=>{
                this.$toast.show(data.message,'success')
                this.loadAttendance()
            })
            .catch((err)=>{
                this.$toast.show(err,'error')
            })
        }
    }
}
</script>
