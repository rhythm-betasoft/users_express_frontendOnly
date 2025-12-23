<template>
  <v-container>
    <h2 class="text-center mt-5">My Leaves</h2>
  </v-container>
  <v-container>
    <DxDataGrid :data-source="LeaveData.dataSource"
      :remote-operations="{ filtering: true, sorting: true, paging: true }" :show-borders="true"
      :column-auto-width="true" :row-alternation-enabled="true"
      :filter-row="{ visible: true, showOperationChooser: true }" ref="leavedataref" :paging="LeaveData.pagingOption"
      :pager="LeaveData.pagerOption">
      <DxToolbar>
        <DxItem location="after" widget="dxButton" :options="defination.createButtonOptions" />
      </DxToolbar>
      <DxColumn data-field="leaveType" alignment="center" caption="Leave Type" :hiding-priority="2" />
      <DxColumn data-field="leaveDurationType" alignment="center" caption="Leave Duration" :hiding-priority="4" />
      <DxColumn data-field="startDate" alignment="center" caption="Start Date" data-type="date" :hiding-priority="5"
        format="dd-MM-yyyy" />
      <DxColumn data-field="endDate" alignment="center" caption="End Date" data-type="date" :hiding-priority="6"
        format="dd-MM-yyyy" />
      <DxColumn caption="No of days" alignment="center" :calculate-cell-value="noOfDays" :hiding-priority="1" />
      <DxColumn data-field="reason" alignment="center" caption="Reason" :hiding-priority="3" />
      <DxColumn :calculate-cell-value="this.$utils.leaveStatus" alignment="center" caption="status"/>
    </DxDataGrid>
  </v-container>
  <ApplyLeave v-if="applyLeaveDialog" @closed="closeApplyLeaveDialog" />
</template>
<script>
import dataGridMixin from "@/mixins/dataGridMixin";
import ApplyLeave from "@/components/Dialogs/ApplyLeave.vue";
export default {
  components: {
    ApplyLeave
  },
  mixins: [dataGridMixin],
  data() {
    return {
      leavedataref: null,
      applyLeaveDialog: false,
      defination: {
        createButtonOptions: {
          icon: "add",
          text: "Apply",
          onClick: () => this.openApplyLeaveDialog(),
        },
      }
    };
  },
  computed: {
    LeaveData() {
      return this.dataSource(
        "/leaves/list",
      );
    },
  },
  methods: {
    noOfDays(rowData) {
      return (new Date(rowData.endDate) - new Date(rowData.startDate)) / (1000 * 60 * 60 * 24)
    },
    openApplyLeaveDialog() {
      this.applyLeaveDialog = true
    },
    closeApplyLeaveDialog() {
      this.applyLeaveDialog = false
      this.refreshTable("leavedataref", true)
    }
  },
};
</script>
