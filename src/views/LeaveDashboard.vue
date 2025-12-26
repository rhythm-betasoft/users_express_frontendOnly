<template>
  <v-container>
    <h2 class="text-center mt-5">Leaves</h2>
  </v-container>
  <v-container>
    <DxDataGrid :data-source="LeaveData.dataSource"
      :remote-operations="{ filtering: true, sorting: true, paging: true }" :show-borders="true"
      :column-auto-width="true" :row-alternation-enabled="true"
      :filter-row="{ visible: true, showOperationChooser: true }" ref="leavedataref" :paging="LeaveData.pagingOption"
      :pager="LeaveData.pagerOption">
      <DxColumn data-field="username" alignment="center" caption="Name" :hiding-priority="0" />
      <DxColumn data-field="leaveType" alignment="center" caption="Leave Type" :hiding-priority="2" />
      <DxColumn data-field="leaveDurationType" alignment="center" caption="Leave Duration" :hiding-priority="4" />
      <DxColumn data-field="startDate" alignment="center" caption="Start Date" data-type="date" :hiding-priority="5"
        format="dd-MM-yyyy" />
      <DxColumn data-field="endDate" alignment="center" caption="End Date" data-type="date" :hiding-priority="6"
        format="dd-MM-yyyy" />
      <DxColumn caption="No of days" alignment="center" :calculate-cell-value="noOfDays" :hiding-priority="1" />
      <DxColumn data-field="reason" alignment="center" caption="Reason" :hiding-priority="3" />
     <DxMasterDetail :enabled="true" template="myDetail" />

<template #myDetail="{ data }">
  <LeaveDetails :leave="data.data" @updated="refreshTable('leavedataref', true)" />
</template>
    </DxDataGrid>
  </v-container>
</template>
<script>
  import {defineAsyncComponent} from 'vue'
import dataGridMixin from "@/mixins/dataGridMixin";
  const LeaveDetails=defineAsyncComponent(()=>import('@/components/LeaveDetails.vue'))
export default {
  components: {
    LeaveDetails
  },
  mixins: [dataGridMixin],
  data() {
    return {
      leavedataref: null
    };
  },
  computed: {
    LeaveData() {
      return this.dataSource(
        "/leaves/lists",
      );
    },
  },
  methods: {
    noOfDays(rowData) {
      return (new Date(rowData.endDate) - new Date(rowData.startDate)) / (1000 * 60 * 60 * 24)
    }
  },
};
</script>
