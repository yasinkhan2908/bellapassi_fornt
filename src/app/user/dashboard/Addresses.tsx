'use client';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { AccountSidebar } from './AccountSidebar';
import Swal from 'sweetalert2';
//
export default function Addresses() {
    const router = useRouter(); // ✅ initialize router
    //toast.loading('Logging in...');
    interface Address {
        id: string;
        name: string;
        address_line_1: string;
        email: string;
        mobile: string;
        default_address: number;
        // add other fields if needed
    }
    const [addresses, setAddresses] = useState<Address[]>([]);
    
    // ✅ Fetch current profile on page load
    useEffect(() => {
        //console.log("local token",localStorage.getItem('token'))
        const fetchProfile = async () => {
            try {
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/shipping-address`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    cache: 'no-store', // ensures fresh data each time
                });
                //console.log('data', data.data);
                const responseData = await data.json();
                const result = responseData.data;
                setAddresses(result);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);

    
    const removeAddress = (id: string) => {
        Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to remove this! ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ee44cff',
        cancelButtonColor: 'rgba(222, 41, 50, 1)',
        confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/remove-shipping-address/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    cache: 'no-store', // ensures fresh data each time
                });
                const responseData = await data.json();
                if (responseData.success === false) {
                    toast.dismiss();
                    toast.error(responseData.message || 'Something went wrong!');
                    return;
                }
                Swal.fire({
                    title: 'Success',
                    text: "Address remove successfully ",
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#2ee44cff',
                    cancelButtonColor: 'rgba(222, 41, 50, 1)',
                    confirmButtonText: 'Ok'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setAddresses(responseData.data);
                    }
                });
            }
        });
    };

    
    
    const markAddressDefault = (id: string) => {
        Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to mark as default this! ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ee44cff',
        cancelButtonColor: 'rgba(222, 41, 50, 1)',
        confirmButtonText: 'Yes, do it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/mark-as-default-address/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    cache: 'no-store', // ensures fresh data each time
                });
                const responseData = await data.json();
                if (responseData.success === false) {
                    toast.dismiss();
                    toast.error(responseData.message || 'Something went wrong!');
                    return;
                }
                toast.dismiss();
                toast.success(responseData.message || 'Successfully mark as default address!');
                //
                setAddresses(responseData.data);
            }
        });
    };
    //console.log("addresses",addresses);
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
                                <div className="tab-pane fade active show" id="addresses" role="tabpanel">
                                    <div className="section-header aos-init aos-animate" data-aos="fade-up">
                                        <h2>My Address</h2>
                                        <div className="header-actions">
                                            <Link href="/user/add-address" type="button" className="btn btn-primary text-white">
                                                <i className="bi bi-plus-lg"></i>
                                                Add New Address
                                            </Link>
                                        </div>
                                    </div>
                                    {addresses.map((addr, index) => (
                                        <div key={index} className="addresses-grid">                                        
                                            <div
                                                className={`address-card aos-init aos-animate mt-3 ${
                                                    addr.default_address==1 ? 'active' : ''
                                                }`}
                                                data-aos="fade-up"
                                                data-aos-delay="200"
                                                >
                                                <div className="card-header">
                                                    <h4>{addr.name}</h4>
                                                </div>
                                                <div className="card-body">
                                                    <p className="address-text"><i className="bi bi-geo-alt"></i> {addr.address_line_1}</p>
                                                    <div className="contact-info">
                                                        <div><i className="bi bi-envelope"></i> {addr.email}</div>
                                                        <div><i className="bi bi-telephone"></i> {addr.mobile}</div>
                                                    </div>
                                                    <div className="card-actions mt-3">
                                                        <Link href={`/user/edit-address/${addr.id}`} type="button" className="btn btn-primary text-white">
                                                            <i className="bi bi-pencil mr-1"></i>
                                                            Edit
                                                        </Link>
                                                        <button onClick={() => removeAddress(addr.id)} className="btn btn-danger deleteData text-white" data-url="" data-id="">
                                                            <i className="bi bi-trash mr-1"></i>
                                                            Remove
                                                        </button>
                                                        {addr.default_address == 1 ? (
                                                            <button type="button" className="btn btn-success" disabled>
                                                                Default Address
                                                            </button>
                                                        ) : (
                                                            <button type="button" onClick={() => markAddressDefault(addr.id)}  className="btn-make-default makeDefaultAddress">Make Default</button>
                                                        )}
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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