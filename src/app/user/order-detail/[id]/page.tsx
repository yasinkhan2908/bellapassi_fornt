import OrderDetail from "../[id]/OrderDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Order, OrderItem } from '@/types/order';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 Await the params
  const session = await getServerSession(authOptions); 
  const token = session?.user.token;
  console.log(token);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/order-detail/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });
  
  if (!res.ok) return notFound();

  const order = await res.json();
  console.log("order details : ",order);

// Then render it
  return <OrderDetail order={order} />;
}