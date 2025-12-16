<template>
  <v-container>
    <h2 class="text-center mt-5">Announcements</h2>
  </v-container>
  <v-container>
    <DxDataGrid
      :data-source="AnnouncementData.dataSource"
      
      :remote-operations="{ filtering: true, sorting: true, paging: true }"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"   
      :filter-row="{ visible: true, showOperationChooser: true }" ref="announcementdataref"
      :editing="{ allowUpdating: true, allowDeleting: true, allowAdding: true, confirmDelete: true }"
    >
    <DxPaging v-bind="AnnouncementData.paging" />
  <DxPager v-bind="AnnouncementData.pager" />
      <DxToolbar>
        <DxItem location="after" widget="dxButton" :options="defination.createButtonOptions" />
      </DxToolbar>  
      <DxColumn data-field="id" caption="ID" alignment="center" />
      <DxColumn data-field="title" caption="Title" alignment="center" />
      <DxColumn data-field="content" caption="Content" alignment="left" />
      <DxColumn data-field="createdAt" caption="Created At" data-type="date" alignment="center"  />

      <DxColumn type="buttons" >
        <DxButton name="edit" icon="edit" />
        <DxButton name="delete" icon="trash" />
      </DxColumn>
    </DxDataGrid>
  </v-container>
  <add-announcement-dialog v-if="addAnnouncementDialog" @closed="closeAddAnnouncementDialog" />
</template> 

<script>
import dataGridMixin from "../mixins/dataGridMixin";
import AddAnnouncementDialog from '../components/Dialogs/AddAnnouncementDialog.vue'
export default {
    components:{
        AddAnnouncementDialog
    },
  mixins: [dataGridMixin],
  data() {
    return {
      defination: { 
        createButtonOptions: {
          icon: "add",
          text: "Add Announcement",
          onClick: () => this.openAddAnnouncementDialog(),
        },
      },
      addAnnouncementDialog: false,
      announcementdataref:null
    };
  },
  computed: {
    AnnouncementData() {
      return this.dataSource(
        "/announcements/list",
        {},
        "/announcements/add",
        "/announcements/update",
        "/announcements/delete"
      );
    },
  },
  methods: {
    openAddAnnouncementDialog() {
      this.addAnnouncementDialog = true;
    },
    closeAddAnnouncementDialog() {
      this.addAnnouncementDialog = false;
    },
  },
};
</script>
