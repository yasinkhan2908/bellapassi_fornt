"use client";
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function AddressDefault({ id,token }: { id: string , token:string}) {
  
  return (
    <button type="button"  className="btn btn-success" disabled>
        Default Address
    </button>
  );
}
