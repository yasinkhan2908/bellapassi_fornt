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
import { getSessionId } from '@/lib/session';
import { 
  fetchCart
} from '../../lib/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'; // Use typed hooks
import { AppDispatch, RootState } from '@/lib/store';
import { AsyncThunkAction } from '@reduxjs/toolkit';

interface OrderDetail {
  name: string;
  mobile: string;
  address_line_1: string;
}
//
export default function Thanks() {
    const [orderDetail, setOrderDetail] = useState<any>({});
    const { items, total, loading, error } = useAppSelector(state => state.cart); // Use typed selector
    const session = useSession();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const dispatch = useAppDispatch(); // Use typed dispatch
    //console.log("order id",id);

    const sessionId = getSessionId();
    //console.log("login Token", session?.data);
    var token = '';
    if(session?.data?.user?.token)
    {
      token = session?.data?.user?.token;
    }
    else{
      token = '';
    }
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

    useEffect(() => {
        const loadCartData = async () => {
          //if (!token) return;
          
          try {
            // console.log(sessionId);
            // console.log(token);
              const result = await dispatch(
                fetchCart({
                  session_id: sessionId,
                  token: token,
                })
              );
            
            //console.log('Cart loaded successfully:', result);
          } catch (err) {
            console.error('Failed to load cart:', err);
          }
        };
    
        loadCartData();
      }, [dispatch, sessionId, token]);
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


