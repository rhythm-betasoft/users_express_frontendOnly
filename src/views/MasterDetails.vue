<template>
  <div>
    <DxDataGrid :data-source="[master_detail_data]">
      <DxColumn data-field="name" caption="Name" alignment="center" />
       <DxColumn data-field="age" caption="Age" alignment="center" />
        <DxColumn data-field="religion" caption="Religion" alignment="center" />
      <DxColumn data-field="role" caption="Role" alignment="center" />
    </DxDataGrid>
  </div>
</template>

<script setup>
import { DxColumn, DxDataGrid } from 'devextreme-vue/data-grid'

const props = defineProps({
  master_detail_data: Object,
})
</script>
