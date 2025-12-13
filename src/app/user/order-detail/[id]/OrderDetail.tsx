"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch } from "../../../../lib/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { AccountSidebar } from '../../dashboard/AccountSidebar';
// Define and export the Order and OrderItem interfaces
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image?: string;
  quantity: number;
  price: number;
  total: number;
  size?: string;
}

export interface Order {
  data: any;
  order_status: string;
  payment_status: string;
  payment_method: string;
  id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;
  cardHolderName?: string;
  cardLastFour?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  created_at: string | number | Date;
  // Additional fields from API response
  name?: string;
  mobile?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  total_items?: string;
  taxes?: string;
  shipping_charges?: string;
  coupon_discount?: string;
  grand_total?: string;
  order_products?: any[];
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const session = useSession();
  
  console.log("order detail : ", order);
  
  // Helper function to format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };
  
  // Helper function to get image URL
  const getProductImage = (product: any) => {
    return product?.productdetail?.product_image?.small || 
           product?.productdetail?.product_image?.medium || 
           product?.productdetail?.product_image?.larage || 
           product?.productdetail?.product_image?.image || 
           '/images/default-product.jpg';
  };
  
  return (
    <main className="main">
        <section id="account" className="account section">
            <div className='container'>
                <div className="row g-4">
                    
                    <div className="profile-menu mobile-profile-menu d-lg-block" id="profileMenu">            
                        <div id="tabs" className="d-flex justify-between border-t">

                            <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/dashboard">
                                <i className="bi bi-box-seam"></i>
                                <span className="tab tab-home block text-xs">My Orders</span>
                            </Link>

                            <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1 mobile-active" href="/user/my-address">
                                <i className="bi bi-geo-alt"></i>
                                <span className="tab tab-home block text-xs">My Address</span>
                            </Link>

                            <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/account-setting">
                                <i className="bi bi-gear"></i>
                                <span className="tab tab-home block text-xs">Account Settings</span>
                            </Link>

                            <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="#">
                                <i className="bi bi-heart"></i>
                                <span className="tab tab-home block text-xs">Wishlist</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-lg-9">
                        <div className="content-area0">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="addresses" role="tabpanel">
                                    <div className="row  mb-5 pb-5">
                                        <div className="col-lg-8">
                                            
                                            <div className="card order-header">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h1 className="h3 mb-1">Order #{order.data.id}</h1>
                                                        
                                                        <div className="d-flex align-items-center">
                                                            <span className="badge bg-light text-dark me-2">
                                                                <i className="bi bi-calendar-event me-1"></i>
                                                                {new Date(order.data.created_at).toLocaleString("en-IN", {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    second: "2-digit",
                                                                    hour12: false,
                                                                })}
                                                            </span>
                                                            <span className={`badge ${order.data.order_status === 'COD Confirmed' ? 'bg-success' : 'bg-warning'} text-white`}>
                                                                <strong>{order.data.order_status}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className={`badge ${order.data.payment_status === 'cod' ? 'bg-info' : 'bg-success'} text-white`}>
                                                            {order.data.payment_status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="card products-card">
                                                <div className="card-body">
                                                    <h5 className="card-title mb-3">Products ({order.data.total_items} items)</h5>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>Product</th>
                                                                    <th>Price</th>
                                                                    <th>Quantity</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {order.data.order_products?.map((item: { id: any; product_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; product_size: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; product_sku: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; product_price: string | number; product_qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; subtotal: string | number; }, index: any) => (
                                                                    <tr key={item.id || index}>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="me-3" style={{ width: '60px' }}>
                                                                                    <Image
                                                                                        src={getProductImage(item)}
                                                                                        width={60}
                                                                                        height={60}
                                                                                        className="img-fluid rounded"
                                                                                        style={{ objectFit: 'cover' }}
                                                                                        alt={item.id}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <strong>{item.product_name}</strong>
                                                                                    <div className="text-muted small">
                                                                                        Size: {item.product_size}
                                                                                    </div>
                                                                                    <div className="text-muted small">
                                                                                        SKU: {item.product_sku}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {formatCurrency(item.product_price)}
                                                                        </td>
                                                                        <td>{item.product_qty}</td>
                                                                        <td>
                                                                            {formatCurrency(item.subtotal)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="card payment-card">
                                                <div className="card-body">
                                                    <h5 className="card-title mb-3">Payment Details</h5>
                                                    <div className="mb-3">
                                                        <h6>Payment Method</h6>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <i className="bi bi-credit-card me-2 text-primary"></i>
                                                            <span className="text-capitalize">
                                                                {order.data.payment_method === 'cod' ? 'Cash on Delivery' : order.data.payment_method}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <h6>Items Summary</h6>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Subtotal ({order.data.total_items} items)</span>
                                                            <span>{formatCurrency(order.data.subtotal || 0)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span>Shipping</span>
                                                            <span>{formatCurrency(order.data.shipping_charges || 0)}</span>
                                                        </div>
                                                        {parseFloat(order.data.taxes || '0') > 0 && (
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>Tax (GST)</span>
                                                                <span>{formatCurrency(order.data.taxes || 0)}</span>
                                                            </div>
                                                        )}
                                                        {parseFloat(order.data.coupon_discount || '0') > 0 && (
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span>Discount</span>
                                                                <span className="text-success">-{formatCurrency(order.data.coupon_discount || 0)}</span>
                                                            </div>
                                                        )}
                                                        <hr/>
                                                        <div className="d-flex justify-content-between fw-bold">
                                                            <span>Total Amount</span>
                                                            <span>{formatCurrency(order.data.grand_total || 0)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-4">
                                            <div className="card customer-card">
                                                <div className="card-body">
                                                    <div className="mb-4">
                                                        <h6>Shipping Address</h6>
                                                        <div className="bg-light p-3 rounded">
                                                            <strong>{order.data.name}</strong><br/>
                                                            {order.data.address_line_1}<br/>
                                                            {order.data.address_line_2 && `${order.data.address_line_2}`}<br/>
                                                            {order.data.city}, {order.data.state}<br/>
                                                            {order.data.postcode}<br/>
                                                            {order.data.country}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h6>Contact Information</h6>
                                                        {order.data.mobile && (
                                                            <div className="d-flex align-items-center mb-2">
                                                                <i className="bi bi-phone text-muted me-2"></i>
                                                                <a href={`tel:${order.data.mobile}`}>{order.data.mobile}</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="card mt-3">
                                                <div className="card-body">
                                                    <h6 className="card-title mb-3">Order Summary</h6>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Order ID:</span>
                                                        <strong>#{order.data.id}</strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Order Date:</span>
                                                        <span>{new Date(order.data.created_at).toLocaleDateString('en-IN')}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Order Status:</span>
                                                        <span className={`badge ${order.data.order_status === 'COD Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                                                            {order.data.order_status}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <span>Payment Status:</span>
                                                        <span className={`badge ${order.data.payment_status === 'cod' ? 'bg-info' : 'bg-success'}`}>
                                                            {order.data.payment_status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="d-flex d-lg-none justify-content-between align-items-center mt-3">
                                                <button className="btn btn-outline-secondary">
                                                    <i className="bi bi-chevron-left me-1"></i> Previous Order
                                                </button>
                                                <span className="text-muted mx-2">1 / 1</span>
                                                <button className="btn btn-outline-secondary">
                                                    Next Order <i className="bi bi-chevron-right ms-1"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}