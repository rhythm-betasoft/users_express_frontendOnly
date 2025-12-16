import CustomStore from "devextreme/data/custom_store";

const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
};
export default {
  data() {
    return {
      displayMode: "standard",
      pageSizes: [25, 35, 50, 100],
      pageSize: 10,
      childPageSizes:  [7, 10, 15, 25],
      childPageSize:7,
      showPageSizeSelector: true,
      showNavButtons: true,
      showInfo: true,
      skipLoader: true,
      dataGridRefName: "dataGrid",
      showColumnLines: true,
      showRowLines: false,
      refKey: "dataGrid",
      selectedRowsData: [],
      currencyFormat: {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
        useCurrencyAccountingStyle: false
      }
    };
  },
  computed: {
    refName: function () {
      return this.getDataGridRefName(this.refKey);
    },
    dxGrid: function () {
      return this.$refs[this.refName]
        ? this.$refs[this.refName].instance
        : null;
    },
    isMobile: function () {
      return window.isMobile();
    }
  },
  methods: {
    dataSource(
      url,
      params,
      insertURL = null,
      updateURL = null,
      deleteURL = null
    ) {
      const store =  new CustomStore({
        byKey: (key) => {
          return fetch(url + "?id=" + key);
        },
        load: (loadOptions) => {
          const dxKeys = [
            "skip",
            "take",
            "requireTotalCount",
            "requireGroupCount",
            "sort",
            "filter",
            "totalSummary",
            "groupSummary"
          ];
          if (!params) {
            params = {};
          }

          Object.keys(params).forEach((key) => {
            if (dxKeys.indexOf(key) > -1) {
              delete params[key];
            }
          });

          dxKeys.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
              params[i] = `${JSON.stringify(loadOptions[i])}`;
            }
          });

          return this.$api
            .get(url, { params })
            .then(({ data }) => {
              if (this.skipLoader) {
                this.skipLoader = false;
              }
              const response = {};
              response.data = data.data || [];
              if (data.summary) {
                response.summary = data.summary;
              }
              if (data.groupSummary) {
                response.groupSummary = data.groupSummary;
              }
              if (data.totalCount) {
                response.totalCount = data.totalCount;
              } else {
                response.totalCount = 0;
              }
              if (data.groupCount) {
                response.groupCount = data.groupCount;
              }
              return response;
            })
            .catch(() => {
              if (this.skipLoader) {
                this.skipLoader = false;
              }
              throw new Error("Data Loading Error");
            });
        },
        insert: (values) => {
          if (values["__KEY__"]) {
            delete values["__KEY__"];
          }
          return this.$api
            .post(insertURL, values)
            .then(() => {
              return true;
            })
            .catch((error) => {
              throw new Error("Error while adding record");
            });
        },
        update: (key, values) => {
          return this.$api
            .put(updateURL + "/" + key.id, values)
            .then(() => {
              return true;
            })
            .catch((error) => {
              throw new Error("Error while updating record.");
            });
        },
        remove: (key) => {
          return this.$api
            .delete(deleteURL + "/" + key.id)
            .then(() => {
              return true;
            })
            .catch((error) => {
              throw new Error("Error while deleting record.");
            });
        },
      });
      return {
    dataSource: store,
       paging: {
    pageSize: 10
  },
  pager: {
    showPageSizeSelector: true,
    allowedPageSizes: [10, 20, 50, 100],
    showInfo: true,
    showNavButtons: true
  }
      }
    },
    refreshTable(ref, changedOnly = false) {
      const table = ref ?? this.dataGridRefName;
      const dataGrid = this.$refs[table].instance;
      dataGrid.refresh(changedOnly);
    },
    getDataGridRefName(ref_name) {
      this.dataGridRefName = "dataGrid_" + ref_name;
      return this.dataGridRefName;
    },
    getSearchbarWidth(page) {
      if (this.isMobile) {
        if (page == "users") {
          return 300;
        }
        if (page == "expenses") {
          return 150;
        } else {
          return 200;
        }
      } else {
        return 250;
      }
    },
    formatAmount(val) {
      const GBP = new Intl.NumberFormat("en-GB", this.currencyFormat);
      let amount = "0.00";
      if (typeof val.value == "undefined") {
        if (val) {
          amount = val;
        }
      } else {
        amount = val.value ?? "0.00";
      }
      return GBP.format(amount);
    },
    getLookUpSource(url) {
      return window.axios
        .get(url)
        .then(({ data }) => data.data)
        .catch(() => {
          throw new Error("Error while deleting record.");
        });
    },
    formattedDesc(val) {
      if (!val) {
        return "";
      }
      let filtered = val;
      filtered = filtered.replace(/&nbsp;/gi, " ");
      filtered = filtered.replace(/(<([^>]+)>)/gi, "");
      if (filtered.length > 150) {
        filtered = filtered.substr(0, 150) + "...";
      }
      return filtered;
    },
    downloadFile(url, name) {
      window.axios
        .get(url, {
          responseType: "blob"
        })
        .then((resp) => {
          let fileNameResponse = resp.headers["content-disposition"]
            .split("filename=")[1]
            .replace(/['"]+/g, "");
          if (fileNameResponse && fileNameResponse != "") {
            fileNameResponse = fileNameResponse.trim();
            name = fileNameResponse;
          }
          const href = URL.createObjectURL(resp.data);
          const link = document.createElement("a");
          link.href = href;
          link.target = "_blank";
          link.download = true;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click(); // clean up "a" element & remove
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        })
        .catch(({ response, message }) => {
          let msg =
            response && response.data && response.data.message
              ? response.data.message
              : message;
          this.$toast.show(msg, "error");
        });
    },
    fallbackCopyTextToClipboard(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        if (successful) {
          this.$toast.show("Content copied to clipboard", "success");
        }
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }

      document.body.removeChild(textArea);
    },
    copyTextToClipboard(text) {
      const that = this;
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () {
          that.$toast.show("Content copied to clipboard", "success");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
    deleteSelected(ids, refreshCallback, deleteUrl) {
      window.Swal.fire({
        width: "400px",
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: "#2a8b2a",
        cancelButtonColor: "#bc0000",
        html: `<h5>Are you sure</h5>`,
        confirmButtonText: "Yes"
      }).then(async (result) => {
        if (result.value) {
          window.axios
            .post(deleteUrl, { ids })
            .then(({ data }) => {
              this.$toast.show(
                data.message,
                data.status == true || data.status == "success"
                  ? "success"
                  : "error"
              );
              if (data.status && typeof refreshCallback === "function") {
                refreshCallback();
              }
            })
            .catch(({ response, message }) => {
              this.$toast.show(response?.data?.message || message, "error");
            });
        }
      });
    },
    restoreSelected(ids, refreshCallback, url) {
      window.Swal.fire({
        width: "400px",
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: "#2a8b2a",
        cancelButtonColor: "#bc0000",
        html: `<h5>Are you sure</h5>
                `,
        confirmButtonText: "Yes"
      }).then(async (result) => {
        if (result.value) {
          window.axios
            .post(url, { ids })
            .then(({ data }) => {
              this.$toast.show(
                data.message,
                data.status == true || data.status == "success"
                  ? "success"
                  : "error"
              );
              if (data.status) {
                this.refreshTable();
              }
            })
            .catch(({ response, message }) => {
              this.$toast.show(
                response && response.data && response.data.message
                  ? response.data.message
                  : message,
                "error"
              );
            });
        }
      });
    },
   
  },
 
};
