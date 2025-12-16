<template>
     <v-container class="pa-6" fluid>
        <v-row align="center" justify="space-between" class="mb-4 mt-4">
            <v-col cols="12" sm="6" class="d-flex align-center gap-2">
                <v-icon color="primary" size="28">mdi-domain</v-icon>
                <v-text class="text-h5 font-weight-medium">Dashboard</v-text>
            </v-col>
        </v-row>
        <div class="text-h6 mb-4">Quick Stats</div>
        <v-row class="mb-6" dense>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="(value, key) in arr" :key="key">
                <v-card class="pa-6 ma-2" outlined style="border-radius: 14px; min-height: 140px;">
                    <div>{{ key }}</div>
                    <div class="text-h4 font-weight-bold mt-2">{{ value }}</div>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-h6 mb-4">Analytics</div>
        <v-row dense>
            <v-col cols="12" md="6">
                <h1 class="mb-2">Gender</h1>
                <GenderChart :data="arr"/>
            </v-col>
        </v-row> 
    </v-container>
</template>
<script>
import GenderChart from '../components/GenderChart.vue';
export default {
    components:{
       GenderChart
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