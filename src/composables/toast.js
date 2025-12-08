import Swal from "sweetalert2";
 
class swalToast {
    show(message, type, position = 'top-right', timer = 3000) {
        Swal.fire({
            toast: true,
            position: position,
            icon: type,
            title: message,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: type == 'error' && timer == 3000 ? 7000 : timer,
            confirmButtonColor: '#ff0000'
        });
    }
    confirm(message, title = 'Are you sure?') {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            return result.isConfirmed;
        });
    }
}
 
export default  swalToast