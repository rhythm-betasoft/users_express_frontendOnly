<template>
  <DxChart :data-source="chartData" title="Gender Distribution">
    <DxSeries
      argument-field="label"
      value-field="value"
      type="bar"
      color="#4C72B0"
    />
    <DxLegend :visible="true" />
  </DxChart>
</template>
<script>
export default {
  name: "GenderChart",
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    chartData() {
      return [
        { label: "Male", value: this.data.maleCount },
        { label: "Female", value: this.data.femaleCount },
      ];
    },
  },
};
</script>
