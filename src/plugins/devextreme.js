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
import DxPieChart from 'devextreme-vue/pie-chart';
import DxTabPanel from "devextreme-vue/tab-panel";
import "devextreme/dist/css/dx.light.css";
export default {
  install(app) {
    app.component("DxDataGrid", DxDataGrid);
    app.component("DxColumn", DxColumn);
    app.component("DxPaging", DxPaging);
    app.component("DxPager", DxPager);
    app.component("DxToolbar", DxToolbar);
    app.component("DxItem", DxItem);
    app.component("DxButton", DxButton);
    app.component("DxSearchPanel", DxSearchPanel);
    app.component("DxMasterDetail", DxMasterDetail);
    app.component("DxEditing", DxEditing);
    app.component("DxSummary", DxSummary);
    app.component("DxTotalItem", DxTotalItem);
    app.component("DxChart", DxChart);
    app.component("DxSeries", DxSeries);
    app.component("DxArgumentAxis", DxArgumentAxis);
    app.component("DxLabel", DxLabel);
    app.component("DxLegend", DxLegend);
    app.component("DxTooltip", DxTooltip);
    app.component("DxTabPanel", DxTabPanel);
    app.component("DxPieChart",DxPieChart)
  },
};