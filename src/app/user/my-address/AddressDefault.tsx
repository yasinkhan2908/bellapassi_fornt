"use client";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function AddressDefault({ id,token }: { id: string , token:string}) {
  const router = useRouter(); // ✔️ correct router
  function handleMarkAsDefault() {
    //console.log("mark id", id);
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to mark as default this! ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ee44cff',
        cancelButtonColor: 'rgba(222, 41, 50, 1)',
        confirmButtonText: 'Yes, do it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mark-as-default-address/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store', // ensures fresh data each time
                });
                const responseData = await data.json();
                if (responseData.success === false) {
                    toast.dismiss();
                    toast.error(responseData.message || 'Something went wrong!');
                    return;
                }
                toast.dismiss();
                toast.success(responseData.message || 'Successfully mark as default address!');
                //
                router.refresh(); // 🔥 force server component to re-render
            }
        });
  }

  return (
    <button type="button" onClick={handleMarkAsDefault} className="btn-make-default makeDefaultAddress">Make Default</button>
    
  );
}
