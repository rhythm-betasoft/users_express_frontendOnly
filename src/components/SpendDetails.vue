<template>
  <v-container>
    <DxDataGrid 
      :data-source="spendData.spends" 
      :show-borders="true" 
      :column-auto-width="true"
      :row-alternation-enabled="true" 
      class="mt-5"
    >
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
  }
};
</script>
