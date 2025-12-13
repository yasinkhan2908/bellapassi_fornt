
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.min.css';

import { AccountSidebar } from '../dashboard/AccountSidebar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DeleteButton from "./DeleteButton";
import AddressDefault from "../my-address/AddressDefault";
import AlreadyAddressDefault from "../my-address/AlreadyAddressDefault";

import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

interface Address {
  id: string;
  name: string;
  address_line_1: string;
  email: string;
  mobile: string;
  default_address: number;
}

async function getAddresses(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/shipping-address`, {
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }

    const responseData = await response.json();
    return responseData.data || [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

//
export default async function Addresses() {
    const session = await getServerSession(authOptions);
    console.log("session : ",session?.user.token);
    const token = session?.user.token;
    const addresses = await getAddresses(session?.user.token ?? "");
    // 
    //console.log("addresses",addresses);
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
                                    {addresses.map((addr: { default_address: number; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; address_line_1: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; mobile: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; id: string; }, index: Key | null | undefined) => (
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
                                                            Edit
                                                        </Link>
                                                        <DeleteButton key={addr.id} id={addr.id} token={session?.user.token ?? ""} />
                                                        {addr.default_address == 1 ? (
                                                            
                                                            <AlreadyAddressDefault key={addr.id} id={addr.id} token={session?.user.token ?? ""} />
                                                        ) : (
                                                            <AddressDefault key={addr.id} id={addr.id} token={session?.user.token ?? ""} />
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