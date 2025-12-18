<template>
  <DxChart id="BloodGroupChart" :data-source="BloodGroupChartData" title="Users by Blood Group">
    <DxArgumentAxis />
    <DxValueAxis />
    <DxSeries :value-field="'count'" :argument-field="'blood_group'" type="bar" name="User Count" />
    <DxToolTip :enabled="true" />
  </DxChart>
</template>
<script>
export default {
  name: "BloodGroupChart",
  data() {
    return {
      BloodGroupChartData: []
    };
  },
  mounted() {
    this.fetchBloodGroupCount();
  },
  methods: {
    fetchBloodGroupCount() {
      this.$api.get("/dashboard/blood-groups")
        .then(({ data }) => {
          this.BloodGroupChartData = data;
        })
        .catch(error => {
          this.$toast.show(error, "error");
        });
    }
  }
};
</script>
