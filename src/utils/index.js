class utils {
  formatDate(iso) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-GB");
  }
}
export default utils;
