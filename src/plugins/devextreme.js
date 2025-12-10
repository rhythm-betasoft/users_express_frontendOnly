import DxDataGrid, {
  DxColumn,
  DxPaging,
  DxPager,
  DxToolbar,
  DxItem,
  DxMasterDetail,
  DxButton,
  DxSearchPanel,
  DxEditing,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
import {
  DxChart,
  DxSeries,
  DxArgumentAxis,
  DxLabel,
  DxLegend,
  DxTooltip,
} from "devextreme-vue/chart";
import DxTabPanel from "devextreme-vue/tab-panel";
import "devextreme/dist/css/dx.light.css";
export default {
  install(app) {
    const components = {
      DxDataGrid,
      DxColumn,
      DxPaging,
      DxPager,
      DxToolbar,
      DxItem,
      DxButton,
      DxSearchPanel,
      DxMasterDetail,
      DxEditing,
      DxSummary,
      DxTotalItem,
      DxChart,
      DxSeries,
      DxArgumentAxis,
      DxLabel,
      DxLegend,
      DxTooltip,
      DxTabPanel,
    };
 
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};