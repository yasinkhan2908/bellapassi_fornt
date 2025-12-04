import OrderDetail from "../[id]/OrderDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Order, OrderItem } from '@/types/order';


export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 👈 Await the params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/order-detail/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) return notFound();

  //const order = await res.json();
  // In your parent component
    const exampleOrder: Order = {
        id: "1",
        orderNumber: "DU00017",
        orderDate: "2023-10-03T18:31:00",
        status: "shipped",
        paymentStatus: "paid",
        paymentMethod: "Credit Card",
        transactionId: "#DU444TO10000",
        cardHolderName: "Harold Gonzalez",
        cardLastFour: "6779",
        items: [
            {
            id: "1",
            productId: "101",
            productName: "Women Shoes",
            sku: "WS001",
            image: "/path/to/image.jpg",
            quantity: 1,
            price: 65.29,
            total: 65.29
            }
        ],
        subtotal: 340.00,
        discount: 51.00,
        shippingCharge: 15.00,
        tax: 64.00,
        totalAmount: 368.00
        };

// Then render it
  return <OrderDetail order={exampleOrder} />;
}