<template>
  <v-container>
    <h2 class="text-center mt-5">All Users Details</h2>
  </v-container>
  <v-container>

    <DxDataGrid :data-source="usersData.dataSource" :remote-operations="true" :show-borders="true"
      :column-auto-width="true" :row-alternation-enabled="true" :paging="{ pageSize: 10 }"
      :pager="usersData.paginationOption" :filter-row="{ visible: true, showOperationChooser: true }"
      :ref="usersData.dataGridRef" :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
      @editing-start="onEditClick"
      :editing="{ allowUpdating: true, allowDeleting: true, allowAdding: true, confirmDelete: true }"
      :export="{ enabled: true, filename: 'Users' }" @exporting="usersData.onExporting" @row-prepared="onRowPrepared"       >
      
      <!-- <DxMasterDetail :enabled="true" template="master_detail" /> -->
      <!-- <template #master_detail="{ data }">
        <MasterDetail :master_detail_data="data.data" />
      </template> -->


  <DxMasterDetail :enabled="true" template="master_detail" />
      <template #master_detail="{ data }">
        <SpendDetails :spendData="data.data" />
      </template>



      <DxToolbar>
        <DxItem location="center">
          <DxSearchPanel :visible="true" :width="240" placeholder="Search users..." style="margin-top: 5px  ;"  />
        </DxItem>
        <DxItem location="before" widget="dxButton"
          :options="{ icon: 'plus', text: 'Add User', type: 'success', onClick: openAddDialog }" />
        <DxItem location="after" widget="dxButton"
          :options="{ icon: 'refresh', type: 'default', onClick: refreshData }" />
        <DxItem location="after" widget="dxDropDownButton" :options="{
          icon: 'export',
          text: 'Export',
          items: [
            { text: 'Export as Excel' },
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
        <DxButton name="edit" icon="edit" hint="Edit" />
        <DxButton name="delete" icon="trash" hint="Delete" />
      </DxColumn>

 <!-- <DxColumn data-field="total_salary" visible="false" />
 <DxSummary>
  <DxTotalItem
    column="name"
    summaryType="count"
    showInColumn="name"
    :customizeText="(e) => {
      return `Total Users: ${e.value}`;
    }"
  />
</DxSummary> -->
 <DxSummary>
        <DxTotalItem
          column="salary"
          summaryType="sum"
          displayFormat="Total Salary: {0}"
        />
  </DxSummary>
    </DxDataGrid> 
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit User</v-card-title>  
        <v-card-text>
          <v-text-field v-model="editUser.name" label="Name" />
          <v-text-field v-model="editUser.email" label="Email" />
          <v-select v-model="editUser.gender" :items="['Male', 'Female']" label="Gender" />
          <v-text-field v-model="editUser.blood_group" label="blood_group" />
          <v-text-field v-model="editUser.age" label="age" />
          <v-text-field v-model="editUser.religion" label="religion" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New User</v-card-title>
        <v-card-text>
          <v-text-field v-model="newUser.name" label="Name" />
          <v-text-field v-model="newUser.email" label="Email" />
          <v-text-field v-model="newUser.password" label="Password" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="addDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="createUser">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container class="mb-3">
  </v-container>
</template>
<script setup>
import Swal from 'sweetalert2';
import "devextreme/dist/css/dx.light.css";
import DxDataGrid, { DxColumn, DxButton, DxToolbar, DxItem, DxSearchPanel, DxMasterDetail, DxSummary,DxTotalItem } from "devextreme-vue/data-grid";
import { ref,onMounted } from 'vue';
import api from '../plugins/api';
import dataSource from "../composables/dxgrid2.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MasterDetail from '../views/MasterDetails.vue'
import SpendDetails from '../views/SpendDetails.vue'
const usersData = dataSource(
  "/users",
  {},
  "/users",
  "/users"
);
const summary = dataSource()
onMounted(()=>{
  console.log(usersData)
  console.log(summary)
})
const editDialog = ref(false);
const editUser = ref({});
const onEditClick = (e) => {
  editUser.value = { ...e.data };
  editDialog.value = true;
};
const saveUser = async () => {
  try {
    await api.put(`/users/${editUser.value.id}`, editUser.value);
    editDialog.value = false;
    usersData.refreshTable(usersData.dataGridRef);
    Swal.fire("Success", "User updated successfully", "success");
  } catch (error) {
    console.error("Update failed:", error);
    Swal.fire("Error", "Failed to update user", "error");
  }
};
const addDialog = ref(false);
const newUser = ref({
  name: '',
  email: '',
  password: ''
});
const openAddDialog = () => {
  newUser.value = { name: '', email: '', password: '' };
  addDialog.value = true;
};
const createUser = async () => {
  try {
    await api.post('/users/register', newUser.value);
    addDialog.value = false;
    usersData.refreshTable(usersData.dataGridRef);
    Swal.fire("Success", "User created successfully", "success");
  } catch (error) {
    console.error("User creation failed:", error);
    Swal.fire("Error", "Failed to create user", "error");
  }
};
const onRowPrepared = (e) => {
  if (e.rowType === "data" && e.data.role === "admin") {
    e.rowElement.classList.add("admin-row");
  }
};
const refreshData = () => {
  usersData.refreshTable(usersData.dataGridRef);
};
</script>



<style>
.admin-row {
  background-color: rgb(86, 201, 86) !important;
}

</style>