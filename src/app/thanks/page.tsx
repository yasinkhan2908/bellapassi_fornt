'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface OrderDetail {
  name: string;
  mobile: string;
  address_line_1: string;
}
//
export default function Thanks() {
    const [orderDetail, setOrderDetail] = useState<any>({});

    const session = useSession();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    console.log("order id",id);
        // ✅ Fixed useEffect hook
    useEffect(() => {
        const fetchAddress = async () => {
            // try {
            const token = session?.data?.user.token;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/thanks-order-detail/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            
            const result = await response.json();
            console.log("result : ",result.data);
            if (result.data) {
                setOrderDetail(result.data);
            }
        };
    
        if (id) fetchAddress();
        }, [id]);
  return (
    <div className="d-flex h-screen mt-20 justify-center">
      <div>
        <div className="z-10">
          <div className="p-4 bg-white mx-auto rounded-2xl w-80 confirm-order">
            <div className="mb-4">
              <i className='bi bi-check'></i>
              <h5>Order confirmed</h5>
              <p>Your order is confirmed. You will receive an order confirmation email/SMS shortly with the expected delivery date for your items.</p>
            </div>
          </div>
          
          <div className="p-4 bg-white mx-auto rounded-2xl w-80 confirm-order order-delivery-to">
            <div className="mb-4">
              <p><strong># {orderDetail?.id}</strong></p>
              <p>Delivering to : </p>
              <p>{orderDetail?.name} | {orderDetail?.mobile} </p>
              <p>{orderDetail?.address_line_1} </p>
              <button className='btn btn-primary detail-order-btn'>ORDER DETAIL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

