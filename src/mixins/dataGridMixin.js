import { ref, computed } from "vue";
import CustomStore from "devextreme/data/custom_store";
import axios from "axios";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../plugins/api";
import Swal from "sweetalert2";

const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
};
export default function dataSource(
  url,
  params = {},
  deleteURL = null,
  updateURL = null,
  customRefName = null,
  insertURL = null
) {
  const skipLoader = ref(true);
  const dataGridRefName = customRefName ?? ref(null);
  const refKey = ref("dataGrid");
  const paginationOption = {
    visible: true,
    displayMode: "compact",
    allowedPageSizes: [10, 25, 50],
    childAllowedPageSizes: [7, 15, 25],
    showPageSizeSelector: true,
    showInfo: true,
    showNavigationButton: true,
    mobilePage: 5,
    defaultPage: 10,
  };

  const dataSource = new CustomStore({
    byKey: async (key) => {
      try {
        const response = await api.get(`/users`, { params: { id: key } });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch item by key");
      }
    },
    load: async function (loadOptions) {
      const dxKeys = [
        "skip",
        "take",
        "requireTotalCount",
        "requireGroupCount",
        "sort",
        "filter",
      ];
      let queryParams = params || {};
      Object.keys(params).forEach((key) => {
        if (dxKeys.includes(key)) {
          delete queryParams[key];
        }
      });
      dxKeys.forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          queryParams[i] = `${JSON.stringify(loadOptions[i])}`;
        }
      });try{
        const response = await api.get(url, { params: queryParams });
        return {
          data: response.data.data || [],
        };
        }
        catch(error){
          throw new Error("Error while fetching record");
        }
    },
    insert: async function (values) {
      try {
        await axios.post(insertURL, values);
        return true;
      } catch (error) {
        throw new Error("Error while adding record");
      }
    },
    update: async function (key, values) {
      try {
        await api.put(`${updateURL}/${key.id}`, values);
        return true;
      } catch (error) {
        throw new Error("Error while updating record.");
      }
    },
    remove: async function (key) {
      try {
        await api.delete(`${deleteURL}/${key.id}`);
        return true;
      } catch (error) {
        throw new Error("Error while deleting record.");
      }
    },
  });
  const onExporting = async (e = null) => {
    e && (e.cancel = true);
    const gridInstance = e?.component || dataGridRefName.value?.instance;
    if (!gridInstance) return;
    const selectedData = gridInstance.getSelectedRowsData();
    const result = await Swal.fire({
      title: "Export Users",
      text: "Do you want to export selected users or all users?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Selected Users",
      cancelButtonText: "All Users",
      reverseButtons: true,
    });
    let dataToExport = [];
    if (result.isConfirmed) {
      if (selectedData.length === 0) {
        Swal.fire(
          "No Selection",
          "Please select at least one user.",
          "warning"
        );
        return;
      }
      dataToExport = selectedData;
    } else {
      try {
        const response = await api.get("/user/list");
        dataToExport = response.data.data;
      } catch (error) {
        Swal.fire("Error", "Failed to fetch users.", "error");
        return;
      }
    }
    if (dataToExport.length === 0) return;
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Exported Data");
    const columns = Object.keys(dataToExport[0]);
    worksheet.addRow(columns);
    dataToExport.forEach((row) => {
      worksheet.addRow(columns.map((col) => row[col]));
    }); 
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { name: "Arial", size: 12 };
        cell.alignment = { horizontal: "left" };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "Users.xlsx"
    );
  };

  const onExportingPDF = async (e = { cancel: false }) => {
    e.cancel = true;

    const dataGrid = dataGridRefName.value?.instance;
    if (!dataGrid) return;

    const selectedData = dataGrid.getSelectedRowsData();

    const result = await Swal.fire({
      title: "Export to PDF",
      text: "Do you want to export selected users or all users?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Selected Users",
      cancelButtonText: "All Users",
      reverseButtons: true,
    });
    let dataToExport = [];
    if (result.isConfirmed) {
      if (selectedData.length === 0) {
        Swal.fire(
          "No Selection",
          "Please select at least one user.",
          "warning"
        );
        return;
      }
      dataToExport = selectedData;
    } else {
      try {
        const response = await api.get("/user/list");
        dataToExport = response.data.data;
      } catch (error) {
        Swal.fire("Error", "Failed to fetch users.", "error");
        return;
      }
    }

    if (dataToExport.length === 0) return;

    const doc = new jsPDF();
    const columns = Object.keys(dataToExport[0]);
    const rows = dataToExport.map((row) => columns.map((col) => row[col]));
    autoTable(doc, {
      head: [columns],
      body: rows,
    });
    doc.save("Users.pdf");
  };

  const refreshTable = (dataGridRef, changedOnly = false) => {
    if (!dataGridRef) {
      return;
    }
    const dataGrid = dataGridRef.value?.instance;

    if (!dataGrid) {
      return;
    }

    dataGrid.refresh(changedOnly);
  };
  const getDataGridRefName = (ref_name) => {
    return (dataGridRefName.value = "dataGrid_" + ref_name);
  };
  const refName = computed(() => {
    return getDataGridRefName(refKey.value);
  });
  const dxGrid = computed(() => {
    return dataGridRefName ? dataGridRefName.value.instance : null;
  });

  const isMobile = computed(() => {
    return window.innerWidth <= 768;
  });

  return {
    dataGridRef: dataGridRefName,
    dxGrid,
    refName,
    dataSource,
    refKey,
    skipLoader,
    refreshTable,
    getDataGridRefName,
    onExporting,
    onExportingPDF,
    paginationOption,
    isMobile,
  };
}
