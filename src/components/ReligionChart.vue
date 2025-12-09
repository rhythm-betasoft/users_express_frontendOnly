<template>
  <DxChart id="religionChart" :data-source="religionChartData" title="Users by Religion" style="margin-top: 40px;">
    <DxArgumentAxis />
    <DxValueAxis />
    <DxSeries value-field="count" argument-field="religion" type="bar" name="User Count" color="#42a5f5" />
    <DxTooltip :enabled="true" />
  </DxChart>
</template>
<script>
import api from '@/plugins/api';
export default {
  inject:['toast'],
   name: 'ReligionChart',
  data() {
    return {
      religionChartData: [],
    };
  },
  methods: {
    fetchReligionCounts() {
      api.get('/user/religion-counts')
        .then(({ data }) => {
          this.religionChartData = data;
        })
        .catch(error => {
          this.toast.show(error, 'error');
        });
    },
  },
  mounted() {
    this.fetchReligionCounts();
  },
};
</script>
<style scoped>
#religionChart {
  max-width: 600px;
  margin: 40px auto;
}
</style>