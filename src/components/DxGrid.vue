<!-- <template>
  <v-container fluid class="pa-0 ma-0">


    <DxDataGrid
      :data-source="usersData.dataSource"
      :remote-operations="true"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :paging="{ pageSize: 10 }"
      :pager="usersData.paginationOption"
      :filter-row="{ visible: true, showOperationChooser: true }"
      ref="usersData.dataGridRef"
      :editing="{ mode: 'row', allowUpdating: true, allowDeleting: true }"
    >
      
      <DxColumn data-field="id" caption="Id" alignment="center" width="150" />
      <DxColumn data-field="name" caption="Name" alignment="center" width="250" />
      <DxColumn data-field="gender" caption="Gender" alignment="center" width="250" />
      <DxColumn data-field="blood_group" caption="Blood Group" alignment="center" />
      <DxColumn data-field="email" caption="Email" alignment="center" width="500" />
      <DxColumn data-field="role" caption="Role" width="100" alignment="center" />

      <DxColumn type="buttons" width="120" alignment="center">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>
    </DxDataGrid>
  </v-container>
</template>

<script setup>
import DxDataGrid, { DxColumn, DxButton } from "devextreme-vue/data-grid";
import useUsersData from '../composables/dxgrid'; 

const usersData = useUsersData();
</script> -->

<template>
<h1>aa</h1>
</template>