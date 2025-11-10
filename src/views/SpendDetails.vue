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
  <DxDataGrid
    :data-source="normalizedData"
    :show-borders="true"
    :column-auto-width="true"
    :row-alternation-enabled="true"
    :paging="{ enabled: false }"
    :filter-row="{ visible: false }"
  >
    <DxColumn data-field="salary" caption="Salary" format="currency" alignment="center" />
    <DxColumn data-field="expenses" caption="Expenses" format="currency" alignment="center" />
    <DxColumn data-field="saving" caption="Saving" format="currency" alignment="center" />
  </DxDataGrid>
</template>

<script setup>
import { computed } from 'vue';
import DxDataGrid, { DxColumn } from 'devextreme-vue/data-grid';

const props = defineProps({
  spendData: {
    type: Object,
    default: () => ({})
  }
});

const normalizedData = computed(() => {
  return props.spendData?.spends ?? [];
});
</script>

