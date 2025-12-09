<template>
  <v-container>
    <h2 class="text-center mt-5">All Users Details</h2>
  </v-container>
  <v-container>
    <DxTabPanel :items="tabItems" :animation-enabled="true" height="700">
      <template #userGrid>
        <DxDataGrid :data-source="usersData.dataSource"
          :remote-operations="{ filtering: true, sorting: true, paging: true }" :show-borders="true"
          :column-auto-width="true" :row-alternation-enabled="true" :paging="{ pageSize: 10 }"
          :pager="usersData.paginationOption" :filter-row="{ visible: true, showOperationChooser: true }"
          :ref="usersData.dataGridRef" :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
          :editing="{ allowUpdating: true, allowDeleting: true, allowAdding: true, confirmDelete: true }"
          :export="{ enabled: true, filename: 'Users' }" @exporting="usersData.onExporting"
          @row-prepared="onRowPrepared">
          <DxMasterDetail :enabled="true" template="master_detail" />
          <template #master_detail="{ data }">
            <SpendDetails :spendData="data.data" />
          </template>

          <DxToolbar>
            <DxItem location="after" widget="dxButton" :options="defination.createButtonOptions" />
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
          <DxColumn data-field="email" caption="Email" alignment="center" width="400" />
          <DxColumn data-field="role" caption="Role" width="100" alignment="center" />
          <DxColumn data-field="salary" caption="Salary" alignment="center" data-type="number" format="currency" />
          <DxColumn type="buttons" width="200">
            <DxButton name="edit" icon="edit" />
            <DxButton name="delete" icon="trash" />
            <DxButton name="pin" icon="pin" :onClick="e => togglePin(e.row.data)" />
          </DxColumn>

          <DxSummary>
            <DxTotalItem column="salary" summaryType="sum" />
          </DxSummary>
        </DxDataGrid>
      </template>

      <AddUserDialog v-if="addDialog" @closed="closeAddDialog" />

      <template #religionChart>
        <ReligionChart />
      </template>
    </DxTabPanel>
  </v-container>
</template>

<script>
import datagridMixin from "@/mixins/dataGridMixin.js";
import SpendDetails from "@/components/SpendDetails.vue";
import DxTabPanel from "devextreme-vue/tab-panel";
import AddUserDialog from "@/components/Dialogs/AddUserDialog.vue";
import ReligionChart from "@/components/ReligionChart.vue";
import { roles } from "@/enums/roles.js";
import api from "@/plugins/api";
import dataSource from "@/mixins/dataGridMixin.js";
export default {
  mixins: [datagridMixin],
  inject:['toast'],
  components: {
    SpendDetails,
    DxTabPanel,
    AddUserDialog,
    ReligionChart,
  },
  data() {
    return {
      tabItems: [
        { title: "User Grid", template: "userGrid" },
        { title: "Religion Chart", template: "religionChart" },
      ],
      addDialog: false,
      defination: {
        createButtonOptions: {
          icon: "add",
          onClick: () => this.openAddDialog(),
        },
      },
    };
  },
  computed: {
    usersData() {
      return this.createUsersDataSource();
    }
  },
  methods: {
    createUsersDataSource() {
      return dataSource(
        "/user/list",
        {},
        "/user/delete",
        "/user/update",
        null,
        "/user/insert"
      );
    },
    openAddDialog() {
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    onRowPrepared(e) {
      if (e.rowType === "data") {
        const rowEl = e.rowElement;
        if (e.data.role === roles.ADMIN) {
          rowEl.classList.add("admin-row");
        }
        if (e.data.pinned) {
          rowEl.classList.add("pinned-row");
        }
      }
    },
    togglePin(rowData) {
      api.put(`/user/${rowData.id}/pin`)
        .then(({ data }) => {
          this.usersData.refreshTable(this.usersData.dataGridRef);
          this.toast.show(data.message, 'success')
        })
        .catch((error) => {
          this.toast.show(error, 'error')
        });
    },
  },
};
</script>


<style scoped>
:deep(.admin-row) {
  background-color: #d3f9d8;
}
:deep(.pinned-row) {
  background-color: #fff8c7;
}
</style>