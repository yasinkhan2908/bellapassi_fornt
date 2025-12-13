'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Image from "next/image";

import { AccountSidebar } from './AccountSidebar';
import { MobileAccountSidebar } from './MobileAccountSidebar';

import { useSession } from 'next-auth/react';

import CancelOrder from "./CancelOrder";

export default function Dashboard() {
    const router = useRouter();
    const session = useSession();
    const data = session?.data?.user.token ?? null;
    
    const [mobile_number, setMobileNumber] = useState('');
    const [result, setResult] = useState<{ error?: string; data?: any } | null>(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // Static array for status filter
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    // Static array of all possible order statuses
    const availableStatuses = [
        'all',
        'COD Confirmed',
        'Delivered',
        'Shipped',
        'Delivered',
        'Cancelled',
    ];
    
    interface OrderProduct {
        [x: string]: any;
        id: number;
        product_image?: string;
        product_name?: string;
    }
    
    interface Order {
        id: number;
        order_status: string;
        grand_total: string;
        total: number;
        items: number;
        created_at: string;
        order_products: OrderProduct[];
        payment_method: string;
    }

    const [Orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    const fetchOrders = async (pageNumber: number) => {
        setLoading(true);
        try {
            const token = session?.data?.user.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders?page=${pageNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await res.json();

            const orders = data.orders.data || [];
            setOrders(orders);
            setFilteredOrders(orders); // Initialize filtered orders
            
            setLastPage(data.orders.last_page);
            setPage(data.orders.current_page);
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setLoading(false);
    };

    // Apply status filter when statusFilter or Orders change
    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrders(Orders);
        } else {
            const filtered = Orders.filter(order => order.order_status === statusFilter);
            setFilteredOrders(filtered);
        }
    }, [statusFilter, Orders]);

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        // Reset to first page when changing filters
        if (page !== 1) {
            setPage(1);
        }
    };

    // Get status badge class based on status
    const getStatusClass = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('cancel') || statusLower.includes('reject')) {
            return 'status cancelled';
        } else if (statusLower.includes('deliver') || statusLower.includes('complete')) {
            return 'status delivered';
        } else if (statusLower.includes('process') || statusLower.includes('confirm')) {
            return 'status processing';
        } else if (statusLower.includes('pending') || statusLower.includes('cod')) {
            return 'status pending';
        } else if (statusLower.includes('ship')) {
            return 'status shipped';
        } else if (statusLower.includes('return') || statusLower.includes('refund')) {
            return 'status returned';
        } else if (statusLower.includes('hold')) {
            return 'status hold';
        } else if (statusLower.includes('fail')) {
            return 'status failed';
        }
        return 'status processing';
    };

    return (
        <main className="main">
            <section id="account" className="account section">
                <div className='container'>
                    <div className="row g-4">
                        <div className="profile-menu mobile-profile-menu d-lg-block" id="profileMenu">            
                            <div id="tabs" className="d-flex justify-between border-t">
                                <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1 mobile-active" href="/user/dashboard">
                                    <i className="bi bi-box-seam"></i>
                                    <span className="tab tab-home block text-xs">My Orders</span>
                                </Link>
                                <Link aria-current="page" className="w-full justify-center inline-block text-center pt-2 pb-1" href="/user/my-address">
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
                            <div className="content-area">
                                <div className="tab-content">
                                    <div className="tab-pane fade active show" id="orders" role="tabpanel">
                                        <div className="section-header aos-init aos-animate" data-aos="fade-up">
                                            <h2>My Orders</h2>
                                        </div>
                                        
                                        {/* Status Filter */}
                                        <div className="status-filter mb-4" data-aos="fade-up" data-aos-delay="50">
                                            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                                <span className="me-2 fw-medium">Filter by status:</span>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => handleStatusChange('all')}
                                                    >
                                                        All Orders
                                                    </button>
                                                    
                                                    {availableStatuses
                                                        .filter(status => status !== 'all')
                                                        .map((status) => (
                                                            <button
                                                                key={status}
                                                                type="button"
                                                                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                onClick={() => handleStatusChange(status)}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            
                                            {/* Or use a dropdown for mobile/small screens */}
                                            <div className="dropdown d-block d-md-none mt-2">
                                                <button className="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                                                    {statusFilter === 'all' ? 'All Statuses' : statusFilter}
                                                </button>
                                                <ul className="dropdown-menu w-100">
                                                    <li>
                                                        <button 
                                                            className={`dropdown-item ${statusFilter === 'all' ? 'active' : ''}`}
                                                            onClick={() => handleStatusChange('all')}
                                                        >
                                                            All Orders
                                                        </button>
                                                    </li>
                                                    {availableStatuses
                                                        .filter(status => status !== 'all')
                                                        .map((status) => (
                                                            <li key={status}>
                                                                <button 
                                                                    className={`dropdown-item ${statusFilter === status ? 'active' : ''}`}
                                                                    onClick={() => handleStatusChange(status)}
                                                                >
                                                                    {status}
                                                                </button>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            
                                            {/* Active filter indicator */}
                                            {statusFilter !== 'all' && (
                                                <div className="mt-2 d-flex align-items-center">
                                                    <span className="badge bg-primary me-2">
                                                        Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="badge bg-info">
                                                        Status: {statusFilter}
                                                        <button 
                                                            className="btn-close btn-close-white ms-2" 
                                                            style={{fontSize: '0.6rem'}}
                                                            onClick={() => handleStatusChange('all')}
                                                            aria-label="Clear filter"
                                                        />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="orders-grid">   
                                            {loading ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2">Loading orders...</p>
                                                </div>
                                            ) : filteredOrders && filteredOrders.length > 0 ? (
                                                <>
                                                    {/* ORDER LIST */}
                                                    {filteredOrders.map((order: Order) => (
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
                                                                        <span className={getStatusClass(order.order_status)}>
                                                                            {order.order_status}
                                                                        </span>
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
                                                                <Link href={`/user/order-detail/${order.id}`}
                                                                    className="btn-details"
                                                                >
                                                                    View Details
                                                                </Link>
                                                                
                                                                {order.payment_method === 'cod' &&
                                                                    order.order_status === 'COD Confirmed' && (
                                                                        <CancelOrder key={order.id} id={order.id} token={session?.data?.user.token ?? ""} />   
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* PAGINATION - Only show if not filtering or if filtered results are paginated */}
                                                    {statusFilter === 'all' && lastPage > 1 && (
                                                        <div className="pagination-container mt-4">
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
                                                    
                                                    {/* Show message when filtering and no results */}
                                                    {statusFilter !== 'all' && filteredOrders.length === 0 && (
                                                        <div className="text-center py-5">
                                                            <div className="text-gray-500 text-lg font-medium mb-3">
                                                                No orders found with status: <strong>{statusFilter}</strong>
                                                            </div>
                                                            <button 
                                                                className="btn btn-primary"
                                                                onClick={() => handleStatusChange('all')}
                                                            >
                                                                View All Orders
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                statusFilter === 'all' && (
                                                    <div className="text-center text-gray-500 py-5 text-lg font-medium">
                                                        🚫 No orders found
                                                    </div>
                                                )
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