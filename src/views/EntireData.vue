<template>
  <v-container>
    <h2 class="text-center mt-5">All Users Details</h2>
  </v-container>
  <v-container>
    <DxTabPanel :items="tabItems" :animation-enabled="true" height="700">
      <template #userGrid>
        <DxDataGrid :data-source="usersData.dataSource" :remote-operations="{ filtering: true, sorting: true, paging: true }"
          :show-borders="true" :column-auto-width="true" :row-alternation-enabled="true" :paging="{ pageSize: 10 }"
          :pager="usersData.paginationOption" :filter-row="{ visible: true, showOperationChooser: true }"
          :ref="usersData.dataGridRef" :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
          @editing-start="onEditClick" :editing="{ allowUpdating: true, allowDeleting: true, allowAdding: true, confirmDelete: true }"
          :export="{ enabled: true, filename: 'Users' }" @exporting="usersData.onExporting" @row-prepared="onRowPrepared">
          <DxMasterDetail :enabled="true" template="master_detail" />
          <template #master_detail="{ data }">
            <SpendDetails :spendData="data.data" />
          </template>
          <DxToolbar>
            <DxItem location="center">
              <DxSearchPanel :visible="true" :width="240" placeholder="Search users..." style="margin-top: 5px ;" />
            </DxItem>
            <DxItem location="before" widget="dxButton" :options="{ icon: 'plus', text: 'Add User', type: 'success', onClick: openAddDialog }" />
            <DxItem location="after" widget="dxButton" :options="{ icon: 'refresh', type: 'default', onClick: refreshData }" />
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
          <DxColumn data-field="gender" caption="Gender" alignment="center" width="250" :groupIndex="0" />
          <DxColumn data-field="blood_group" caption="Blood Group" alignment="center" />
          <DxColumn data-field="email" caption="Email" alignment="center" width="500" />
          <DxColumn data-field="role" caption="Role" width="100" alignment="center" />
          <DxColumn data-field="salary" caption="Salary" alignment="center" data-type="number" format="currency" />
          <DxColumn type="buttons" width="120">
            <DxButton name="edit" icon="edit" hint="Edit" />
            <DxButton name="delete" icon="trash" hint="Delete" />
            <DxButton name="pin" icon="pin" :onClick="e => togglePin(e.row.data)" />
          </DxColumn>
          <DxSummary>
            <DxTotalItem column="salary" summaryType="sum" :customizeText="e => { const val = Number(e.value); return isNaN(val) ? 'Total Salary: $0' : `Total Salary: $${val.toLocaleString()}`; }" />
            <DxGroupItem column="salary" summary-type="sum" show-in-group-footer="true" />
          </DxSummary>
        </DxDataGrid>
      </template>
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
      <template #religionChart>
        <DxChart id="religionChart" :data-source="religionChartData" title="Users by Religion" style="margin-top: 40px;">
          <DxArgumentAxis />
          <DxValueAxis />
          <DxSeries value-field="count" argument-field="religion" type="bar" name="User Count" color="#42a5f5" />
          <DxTooltip :enabled="true" />
        </DxChart>
      </template>
    </DxTabPanel>
  </v-container>
</template>

<script setup>
import Swal from 'sweetalert2';
import "devextreme/dist/css/dx.light.css";
import DxDataGrid, { DxColumn, DxButton, DxToolbar, DxItem, DxSearchPanel, DxMasterDetail, DxSummary, DxTotalItem, DxGroupItem } from "devextreme-vue/data-grid";
import { DxChart, DxSeries, DxArgumentAxis, DxValueAxis, DxTooltip } from 'devextreme-vue/chart';
import { ref, onMounted } from 'vue';
import api from '../plugins/api';
import dataSource from "../composables/dxgrid2.js";
import SpendDetails from '../views/SpendDetails.vue';
import DxTabPanel from 'devextreme-vue/tab-panel';

const usersData = dataSource("/users", {}, "/users", "/users");
const tabItems = [
  { title: 'User Grid', template: 'userGrid' },
  { title: 'Religion Chart', template: 'religionChart' },
];
const religionChartData = ref([]);
const editDialog = ref(false);
const editUser = ref({});
const onEditClick = (e) => {
  editUser.value = { ...e.data };
  editDialog.value = true;
};
const fetchReligionCounts = async () => {
  try {
    const response = await api.get('/users/religion-counts');
    religionChartData.value = response.data.map(item => ({ ...item, count: Number(item.count) }));
  } catch (error) {
    console.error("Error fetching religion counts:", error);
  }
};
onMounted(() => {
  fetchReligionCounts();
});

const saveUser = async () => {
  try {
    await api.put(`/users/${editUser.value.id}`, editUser.value);
    editDialog.value = false;
    usersData.refreshTable(usersData.dataGridRef);
    setTimeout(() => { updateReligionChart(); }, 300);
    Swal.fire("Success", "User updated successfully", "success");
  } catch (error) {
    console.error("Update failed:", error);
    Swal.fire("Error", "Failed to update user", "error");
  }
};

const addDialog = ref(false);
const newUser = ref({ name: '', email: '', password: '' });
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
  if (e.rowType === "data") {
    const rowEl = e.rowElement;
    if (e.data.role === "admin") {
      rowEl.classList.add("admin-row");
    }
    if (e.data.pinned) {
      rowEl.classList.add("pinned-row");
    }
  }
};

const refreshData = () => {
  usersData.refreshTable(usersData.dataGridRef);
};

const togglePin = async (rowData) => {
  try {
    await api.put(`/users/${rowData.id}/toggle-pin`);
    usersData.refreshTable(usersData.dataGridRef);
  } catch (error) {
    console.error("Error toggling pin:", error);
  }
};
</script>

<style>
.admin-row { background-color: rgb(86, 201, 86) !important; }
.pinned-row { background-color: #fff9c4 !important; }
#religionChart { max-width: 600px; margin: 40px auto; }
</style>
