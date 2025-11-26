'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Image from "next/image";

import { AccountSidebar } from './AccountSidebar';

//
export default function Dashboard() {
  const router = useRouter(); // ✅ initialize router
  //toast.loading('Logging in...');
  const [mobile_number, setMobileNumber] = useState('');
  const [result, setResult] = useState<{ error?: string; data?: any } | null>(null);

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
                                        <div className="order-card aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                                            <div className="order-header">
                                                <div className="order-id">
                                                    <span className="label">Order ID:</span>
                                                    <span className="value">#ORD-67</span>
                                                </div>
                                                <div className="order-date">2025-10-14 13:12:35</div>
                                            </div>
                                            <div className="order-content">
                                                <div className="product-grid">
                                                    <Image src="/img/canvas_1760447406.png" height={66} width={66} alt="Product" loading="lazy" />
                                                </div>
                                                <div className="order-info">
                                                    <div className="info-row">
                                                        <span>Status</span>
                                                        <span className="status processing">COD Confirmed</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span>Items</span>
                                                        <span>1 items</span>
                                                    </div>
                                                    <div className="info-row">
                                                        <span>Total</span>
                                                        <span className="price">₹ 768</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="order-footer">
                                                <button type="button" data-href="#" className="btn-details" data-bs-toggle="collapse" data-bs-target="#details1" aria-expanded="false">View Details</button>
                                                <Link href="javascript:void(0)" data-id="67" data-href="#" className="btn btn-danger order-cancled text-white">Cancel Order</Link>
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