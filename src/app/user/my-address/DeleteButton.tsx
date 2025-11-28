"use client";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";


export default function DeleteButton({ id,token }: { id: string , token:string}) {
    const router = useRouter(); // ✔️ correct router
    function handleDelete() {    
        //console.log("delete", id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to remove this! ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ee44cff',
            cancelButtonColor: 'rgba(222, 41, 50, 1)',
            confirmButtonText: 'Yes, delete it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/remove-shipping-address/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        cache: 'no-store', // ensures fresh data each time
                    });
                    const responseData = await data.json();
                    if (responseData.success === false) {
                        toast.dismiss();
                        toast.error(responseData.message || 'Something went wrong!');
                        return;
                    }
                    Swal.fire({
                        title: 'Success',
                        text: "Address remove successfully ",
                        icon: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#2ee44cff',
                        cancelButtonColor: 'rgba(222, 41, 50, 1)',
                        confirmButtonText: 'Ok'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            router.refresh(); // 🔥 force server component to re-render
                        }
                    });
                }
            });
    }

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}
