<template>
  <v-container>
    <DxDataGrid :data-source="normalizedData" :show-borders="true" :column-auto-width="true"
      :row-alternation-enabled="true" :paging="{ enabled: false }" class="mt-5">
      <DxColumn data-field="salary" caption="Salary" format="currency" alignment="center" />
      <DxColumn data-field="expenses" caption="Expenses" format="currency" alignment="center" />
      <DxColumn data-field="saving" caption="Saving" format="currency" alignment="center" />
    </DxDataGrid>
  </v-container>
</template>

<script>
export default {
  props: {
    spendData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    normalizedData() {
      return this.spendData.spends ;
    },
  }
};
</script>
