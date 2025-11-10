<!-- <template>
  <v-container>
    <h2 class="text-center mt-5">All Spend Records</h2>
    <DxDataGrid
      :data-source="spendsData.dataSource"
      :remote-operations="true"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :paging="{ pageSize: 10 }"
      :pager="spendsData.paginationOption"
      :filter-row="{ visible: true }"
      :ref="spendsData.dataGridRef"
    >
     

      <DxColumn data-field="id" caption="ID" alignment="center" width="100" />
      <DxColumn data-field="salary" caption="Salary" alignment="center" format="currency" />
      <DxColumn data-field="expenses" caption="Expenses" alignment="center" format="currency" />
      <DxColumn data-field="saving" caption="Saving" alignment="center" format="currency" />
    </DxDataGrid>
  </v-container>
</template>
<script setup>
import "devextreme/dist/css/dx.light.css";
import DxDataGrid, { DxColumn, DxToolbar, DxItem } from "devextreme-vue/data-grid";
import dataSource from "../composables/dxgrid2.js";


const spendsData = dataSource("/users/spends");
</script> -->
  <template>
  <v-container>

   
    <DxDataGrid
      :data-source="normalizedData"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :paging="{ enabled: false }"
      :filter-row="{ visible: false }"
      class="mt-5"
    >
      <DxColumn data-field="salary" caption="Salary" format="currency" alignment="center" />
      <DxColumn data-field="expenses" caption="Expenses" format="currency" alignment="center" />
      <DxColumn data-field="saving" caption="Saving" format="currency" alignment="center" />
    </DxDataGrid>
     <DxPieChart :data-source="chartData" palette="Soft Pastel" type="doughnut" title="Salary vs Expenses vs Saving" >
      <DxSeries argument-field="type" value-field="value">
        <DxLabel :visible="true" format="currency" :connector="{ visible: true }" />
      </DxSeries>
      <DxTooltip :enabled="true" format="currency" />
      <DxLegend
        orientation="horizontal"
        item-text-position="right"
        horizontal-alignment="center"
        vertical-alignment="bottom"
      />
    </DxPieChart>

  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import DxDataGrid, { DxColumn } from 'devextreme-vue/data-grid';
import DxPieChart, { DxSeries, DxLabel, DxLegend, DxTooltip} from 'devextreme-vue/pie-chart';
const props = defineProps({
  spendData: {
    type: Object,
    default: () => ({})
  }
});
const normalizedData = computed(() => {
  return props.spendData?.spends ?? [];
});
const chartData = computed(() => {
  const spend = props.spendData.spends?.[0] || {};
  return [
    { type: 'Salary', value: Number(spend.salary || 0) },
    { type: 'Expenses', value: Number(spend.expenses || 0) },
    { type: 'Saving', value: Number(spend.saving || 0) },
  ];
});
</script>
