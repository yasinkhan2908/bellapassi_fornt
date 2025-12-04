"use client";
import { useState } from "react";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch } from "../../../../lib/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
}

export interface Order {
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
}

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const session = useSession();
  const data = session?.data?.user.token ?? null;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status step based on order status
  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      'pending': 1,
      'processing': 1,
      'confirmed': 1,
      'packed': 2,
      'shipped': 3,
      'delivered': 4,
      'completed': 4
    };
    return statusMap[status.toLowerCase()] || 1;
  };

  const statusStep = getStatusStep(order.status);
  
  return (
    <div className="index-page">
      <main className="main">
        <section id="product-details" className="product-details section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <div className="mb-5">
                  <h3 className="mb-0">Order Details</h3>
                </div>
              </div>
            </div>
            
            <div>
              <div className="row mb-6">
                <div className="col-12">
                  <div className="progress-container">
                    <ul className="progress-steps">
                      <li className={statusStep >= 1 ? 'active' : ''}>Order Placed</li>
                      <li className={statusStep >= 2 ? 'active' : ''}>Packed</li>
                      <li className={statusStep >= 3 ? 'active' : ''}>Shipped</li>
                      <li className={statusStep >= 4 ? 'active' : ''}>Delivered</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-lg-7 col-xxl-9 col-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="mb-1">Order ID: {order.orderNumber}</h4>
                          <div className="d-flex align-items-center">
                            <small>Order Date: {formatDate(order.orderDate)}</small> 
                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success-soft' : 'badge-danger-soft'} ms-2`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button className="btn btn-primary">Invoice</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="table-responsive table-card">
                        <table className="table text-nowrap mb-0 table-centered">
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Products</th>
                              <th scope="col">Items</th>
                              <th scope="col">Amounts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {item.image && (
                                      <div className="me-3">
                                        <Image 
                                          src={item.image} 
                                          alt={item.productName}
                                          width={60}
                                          height={60}
                                          className="rounded"
                                        />
                                      </div>
                                    )}
                                    <div className="ms-3">
                                      <h5 className="mb-0">
                                        <span className="text-inherit">{item.productName}</span>
                                      </h5>
                                      <small>SKU: {item.sku}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{item.quantity}</td>
                                <td>${item.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-5 col-xxl-3 col-12">
                  <div className="card mb-4 mt-4 mt-lg-0">
                    <div className="card-header">
                      <h4 className="mb-0">Order Summary</h4>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered mb-0">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Descriptions</th>
                            <th scope="col">Amounts</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Sub Total:</td>
                            <td>${order.subtotal.toFixed(2)}</td>
                          </tr>
                          {order.discount > 0 && (
                            <tr>
                              <td>Discount:</td>
                              <td>-${order.discount.toFixed(2)}</td>
                            </tr>
                          )}
                          <tr>
                            <td>Shipping Charge:</td>
                            <td>${order.shippingCharge.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Tax:</td>
                            <td>${order.tax.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Total Amount:</td>
                            <td>${order.totalAmount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header">
                      <h4 className="mb-0">Payment Details</h4>
                    </div>
                    <div className="card-body">
                      <div>
                        <ul className="list-unstyled mb-0">
                          {order.transactionId && (
                            <li className="d-flex justify-content-between mb-2">
                              <span>Transactions:</span> 
                              <span className="text-dark">{order.transactionId}</span>
                            </li>
                          )}
                          <li className="d-flex justify-content-between mb-2">
                            <span>Payment Method:</span> 
                            <span className="text-dark">{order.paymentMethod}</span>
                          </li>
                          {order.cardHolderName && (
                            <li className="d-flex justify-content-between mb-2">
                              <span>Card Holder Name:</span> 
                              <span className="text-dark">{order.cardHolderName}</span>
                            </li>
                          )}
                          {order.cardLastFour && (
                            <li className="d-flex justify-content-between mb-2">
                              <span>Card Number:</span> 
                              <span className="text-dark">xxxx xxxx xxxx {order.cardLastFour}</span>
                            </li>
                          )}
                          <li className="d-flex justify-content-between">
                            <span>Total Amount:</span>
                            <span className="text-dark">${order.totalAmount.toFixed(2)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}