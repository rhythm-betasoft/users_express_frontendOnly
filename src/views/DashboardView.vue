<template>
  <v-container class="pa-6" >
    <v-row align="center" justify="space-between" class="mb-6">
      <v-col cols="12" sm="6" class="d-flex align-center">
        <v-icon color="primary" size="32">mdi-view-dashboard</v-icon>
        <span class="text-h5 font-weight-medium ml-2">Dashboard</span>
      </v-col>
    </v-row>
    <div class="text-h6 font-weight-medium mb-4">Quick Stats</div>
    <v-row class="mb-8" dense>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="(value, key) in arr" :key="key">
        <v-card class="pa-5" outlined elevation="1"
          style="border-radius: 12px; min-height: 140px;"
        >
          <div class="text-subtitle-1 text-grey-darken-1">{{ key }}</div>
          <div class="text-h4 font-weight-bold mt-2">{{ value }}</div>
        </v-card>
      </v-col>
    </v-row>
    <div class="text-h6 font-weight-medium mb-4">Analytics</div>
    <v-row dense>
      <v-col cols="12" md="6">
        <div class="text-subtitle-1 font-weight-medium mb-2">Gender</div>   
        <GenderChart :data="arr" />
      </v-col>
      <v-col cols="12" md="6">
    <div class="text-subtitle-1 font-weight-medium mb-2">Blood Group</div>
    <BloodGroupChart/>
  </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GenderChart from '@/components/GenderChart.vue';
import BloodGroupChart from '../components/BloodGroupChart.vue'
export default {
    components:{
       GenderChart,
       BloodGroupChart
    },
    data(){
        return{
            arr:[]
        }
    },
    methods:{
         fetchData() {
      this.$api.get('/dashboard/cards')
        .then(({ data }) => {
          this.arr = data   
        })
        .catch(error => {
          this.$toast.show(error, 'error')
        })
    }
    },
    mounted(){
        this.fetchData()
    },
}   
</script>