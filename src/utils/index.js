import {Status} from '../enums/leaveStatus'
class utils {
  formatDate(iso) {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-GB");
  }
  leaveStatus = (e) => {
    switch (e.status) {
      case Status.APPROVED:
        return 'Approved'

      case Status.DISAPPROVED:
        return 'Disapproved'

      case Status.PENDING:
        return 'Pending'

      default:
        return ''
    }
   }
}

export default utils;
