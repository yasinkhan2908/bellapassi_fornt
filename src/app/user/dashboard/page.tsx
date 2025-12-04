'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Image from "next/image";

import { AccountSidebar } from './AccountSidebar';
import { useSession } from 'next-auth/react';

//

export default function Dashboard() {
    const router = useRouter(); // ✅ initialize router
    const session = useSession();
    const data = session?.data?.user.token ?? null;
    //toast.loading('Logging in...');
    const [mobile_number, setMobileNumber] = useState('');
    const [result, setResult] = useState<{ error?: string; data?: any } | null>(null);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);

    interface OrderProduct {
        [x: string]: any;
        id: number;
        product_image?: string; // optional
        product_name?: string;
    }
    interface Order {
        id: number;
        order_status: string;
        grand_total:string;
        total: number;
        items: number;
        created_at: string;
        order_products:OrderProduct[]
    }

    const [Orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async (pageNumber: number) => {
        setLoading(true);
        // try {
            const token = session?.data?.user.token;
            console.log("order list : ",`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders?page=${pageNumber}`);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders?page=${pageNumber}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
            });
            const data = await res.json();

            setOrders(data.orders.data);
            console.log("set data : ",data);
            setLastPage(data.orders.last_page);
            setPage(data.orders.current_page);
        // } catch (error) {
        //     console.error("Fetch error:", error);
        // }
        setLoading(false);
    };

  useEffect(() => {
        
        // const fetchOrders = async () => {
        //     const token = session?.data?.user.token;
        //     try {
        //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders`, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${token}`,
        //             }
        //         });
        //         const responseData = await res.json();
        //         const data = responseData;
        //         console.log("Orders data",data.orders);
        //         setOrders(data.orders);
        //         console.log("set Orders:" ,Orders)
                
        //     } catch (err) {
        //         console.error('Error fetching orders:', err);
        //     }
        // };
        // fetchOrders();
        fetchOrders(page);
    }, [page]);

  return (
    <main className="main">
        <section id="account" className="account section">
            <div className='container'>
                <div className="row g-4">
                    <div className="col-lg-3">
                        <AccountSidebar />
                    </div>
                    <div className="col-lg-9">
                        <div className="content-area">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="orders" role="tabpanel">
                                    <div className="section-header aos-init aos-animate" data-aos="fade-up">
                                        <h2>My Orders</h2>
                                    </div>
                                    <div className="orders-grid">   
                                        
                                        {Orders && Orders.length > 0 ? (
                                            <>
                                                {/* ORDER LIST */}
                                                {Orders.map((order: any) => (
                                                    <div key={order.id} className="order-card aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">

                                                        <div className="order-header">
                                                            <div className="order-id">
                                                                <span className="label">Order ID:</span>
                                                                <span className="value">#{order.id}</span>
                                                            </div>
                                                            <div className="order-date">
                                                                {new Date(order.created_at).toLocaleString("en-IN", {
                                                                    year: "numeric",
                                                                    month: "2-digit",
                                                                    day: "2-digit",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    second: "2-digit",
                                                                    hour12: false,
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div className="order-content">
                                                            <div className="product-grid">
                                                                {order.order_products?.map((order_products: any) => (
                                                                    <Image
                                                                        key={order_products.id}
                                                                        src={order_products?.productdetail?.product_image?.image}
                                                                        height={66}
                                                                        width={66}
                                                                        alt="Product"
                                                                        loading="lazy"
                                                                    />
                                                                ))}
                                                            </div>

                                                            <div className="order-info">
                                                                <div className="info-row">
                                                                    <span>Status</span>
                                                                    <span className="status processing">{order.order_status}</span>
                                                                </div>
                                                                <div className="info-row">
                                                                    <span>Items</span>
                                                                    <span>{order.order_products.length} items</span>
                                                                </div>
                                                                <div className="info-row">
                                                                    <span>Total</span>
                                                                    <span className="price">₹ {order.grand_total}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="order-footer">
                                                            <Link
                                                                href={`/user/order-detail/${order.id}`}
                                                                className="btn-details"
                                                            >
                                                                View Details
                                                            </Link>

                                                            <Link href="#" className="btn btn-danger order-cancled text-white">
                                                                Cancel Order
                                                            </Link>
                                                        </div>

                                                    </div>
                                                ))}

                                                {/* PAGINATION */}
                                                {lastPage > 1 && (
                                                    <div className="pagination-container">
                                                         <div className="pagination-container">

                                                            {/* Prev Button */}
                                                            <button
                                                                disabled={page === 1}
                                                                onClick={() => setPage((p) => p - 1)}
                                                                className={`pagination-button pagination-prev ${page === 1 ? 'disabled' : ''}`}
                                                            >
                                                                <svg className="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                </svg>
                                                                Previous
                                                            </button>

                                                            {/* Page Numbers */}
                                                            <div className="pagination-numbers-container">
                                                                {/* First Page */}
                                                                <button
                                                                    onClick={() => setPage(1)}
                                                                    className={`pagination-button pagination-page-button ${page === 1 ? 'active' : ''}`}
                                                                >
                                                                    1
                                                                </button>

                                                                {/* Dots */}
                                                                {page > 3 && <span className="pagination-dots">•••</span>}

                                                                {/* Dynamic Middle Pages */}
                                                                {[...Array(Math.min(5, lastPage))].map((_, i) => {
                                                                    let p;
                                                                    if (lastPage <= 5) {
                                                                        p = i + 1;
                                                                    } else if (page <= 3) {
                                                                        p = i + 2;
                                                                    } else if (page >= lastPage - 2) {
                                                                        p = lastPage - 4 + i;
                                                                    } else {
                                                                        p = page - 2 + i;
                                                                    }
                                                                    
                                                                    if (p <= 1 || p >= lastPage) return null;
                                                                    
                                                                    const isActive = p === page;
                                                                    
                                                                    return (
                                                                        <button
                                                                            key={p}
                                                                            onClick={() => setPage(p)}
                                                                            className={`pagination-button pagination-page-button ${isActive ? 'active' : ''}`}
                                                                        >
                                                                            {p}
                                                                        </button>
                                                                    );
                                                                })}

                                                                {/* Dots */}
                                                                {page < lastPage - 2 && lastPage > 5 && (
                                                                    <span className="pagination-dots">•••</span>
                                                                )}

                                                                {/* Last Page */}
                                                                {lastPage > 1 && (
                                                                    <button
                                                                        onClick={() => setPage(lastPage)}
                                                                        className={`pagination-button pagination-page-button ${page === lastPage ? 'active' : ''}`}
                                                                    >
                                                                        {lastPage}
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Next Button */}
                                                            <button
                                                                disabled={page === lastPage}
                                                                onClick={() => setPage((p) => p + 1)}
                                                                className={`pagination-button pagination-next ${page === lastPage ? 'disabled' : ''}`}
                                                            >
                                                                Next
                                                                <svg className="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>

                                                            {/* Page Info */}
                                                            <div className="pagination-info">
                                                                Page <span className="current-page">{page}</span> of <span className="total-pages">{lastPage}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center text-gray-500 py-5 text-lg font-medium">
                                                🚫 No orders found
                                            </div>
                                        )}

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