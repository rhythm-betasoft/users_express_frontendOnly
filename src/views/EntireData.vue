<template>
  <v-container>
    <h2 class="text-center mt-5">All Users Details</h2>
  </v-container>
  <v-container>
    <DxDataGrid :data-source="usersData.dataSource" :remote-operations="true" :show-borders="true"
      :column-auto-width="true" :row-alternation-enabled="true" :paging="{ pageSize: 10 }"
      :pager="usersData.paginationOption" :filter-row="{ visible: true, showOperationChooser: true }"
      :editing="{ mode: 'row', allowUpdating: true, allowDeleting: true }" :ref="usersData.dataGridRef"
      :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }" :export="{ enabled: true, filename: 'Users' }"
      @exporting="usersData.onExporting">
      <DxToolbar>
        <DxItem location="after" widget="dxButton" :options="{ icon: 'refresh', type: 'default', onClick: refreshData }" />
          <DxItem location="after" widget="dxDropDownButton" :options="{
          icon: 'export',
          text: 'Export',
          items: [
            { text: 'Export as Excel'},
            { text: 'Export to PDF', onClick: () => usersData.onExportingPDF() }
          ],
          displayExpr: 'text',
         onItemClick: (e) => {
    if (e.itemData.text === 'Export as Excel') {
      usersData.onExporting();
    } else if (e.itemData.text === 'Export to PDF') {
      usersData.onExportingPDF();
    }
  }
        }" />
      </DxToolbar>
      
      <DxColumn data-field="id" caption="Id" alignment="center" width="150" />
      <DxColumn data-field="name" caption="Name" alignment="center" width="250" />
      <DxColumn data-field="gender" caption="Gender" alignment="center" width="250" />
      <DxColumn data-field="blood_group" caption="Blood Group" alignment="center" />
      <DxColumn data-field="email" caption="Email" alignment="center" width="500" />
      <DxColumn data-field="role" caption="Role" width="100" alignment="center" />
      <DxColumn type="buttons" width="120">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>
    </DxDataGrid>

  </v-container>

  <v-container class="mb-3">

  </v-container>
  
</template>


<script setup>
import "devextreme/dist/css/dx.light.css";
import DxDataGrid, { DxColumn, DxButton, DxToolbar, DxItem } from "devextreme-vue/data-grid";
import dataSource from "../composables/dxgrid2.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
const usersData = dataSource(
  "/users",
  {},
  "/users",
  "/users"

);
const refreshData = () => {
  usersData.refreshTable(usersData.dataGridRef);
};


</script>



