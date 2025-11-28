'use client';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function AddressPage() {
  return (
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
                <h1 className="mb-2 mb-lg-0">Address</h1>
                <nav className="breadcrumbs">
                    <ol>
                        <li><a href="/">Home</a></li>
                        <li className="current">Address</li>
                        <li className="current">Change Address</li>
                    </ol>
                </nav>
            </div>
        </div>

        <section id="checkout" className="checkout section">
            <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">

                <div className="row">
                    <div className="col-lg-12">
                        <div className="checkout-container aos-init aos-animate" data-aos="fade-up">
                            <form className="checkout-form" action="">
                                <input type="hidden" name="_token" value="DJ5FJvzUzyVzlwCymp6y4apfUUx6RxIurT4yCYCS" />
                                <div className="section-header">
                                    <div className="add-address d-flex flat-title flex-row justify-content-between align-items-center">
                                        <div className="text-left">
                                            <h5>Select Address</h5>
                                        </div>
                                        <div className="text-right">
                                            <Link href="/add-address" className="btn btn-primary btn-sm mb-4 text-white mr-3"><i className="bi bi-plus-lg"></i> Add Address</Link>
                                            <Link href="/address" className="btn btn-primary btn-sm mb-4 text-white"><i className="bi bi bi-arrow-left-short"></i> Back</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="account">
                                    <div className="addresses-grid">                                       
                                                                                        
                                        <div className="address-card aos-init aos-animate active mb-3 d-flex flat-title flex-row" data-aos="fade-up" data-aos-delay="200">
                                            <div className="address-radio float-left mr-3" >
                                                <input type="radio" name="primary_address" id="payment-payu0" value={1} />
                                            </div>
                                            <div className="float-left">
                                                <div className="card-header">
                                                    <h4>yasin khan pathan</h4>
                                                </div>
                                                <div className="card-body">
                                                    <p className="address-text"><i className="bi bi-geo-alt"></i> khajrana dargah ground, Khajrana, Indore, Madhya Pradesh, India</p>
                                                    <div className="contact-info">
                                                        <div><i className="bi bi-envelope"></i> pathan.yasin98@gmail.com</div>
                                                        <div><i className="bi bi-telephone"></i> 9630813268</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                                                                        
                                        <div className="address-card aos-init aos-animate active mb-3 d-flex flat-title flex-row" data-aos="fade-up" data-aos-delay="200">
                                            <div className="address-radio float-left mr-3">
                                                <input type="radio" name="primary_address" id="payment-payu0" value={3} />
                                            </div>
                                            <div className="float-left">
                                                <div className="card-header">
                                                    <h4>yasin khan pathan</h4>
                                                </div>
                                                <div className="card-body">
                                                    <p className="address-text"><i className="bi bi-geo-alt"></i> Vijay Nagar Police Station, Vijay Nagar Square, Vijay Nagar, Indore, Madhya Pradesh, India</p>
                                                    <div className="contact-info">
                                                        <div><i className="bi bi-envelope"></i> pathan.yasin98@gmail.com</div>
                                                        <div><i className="bi bi-telephone"></i> 9630813268</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary ">Confirm</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </section>

      </main>
    </div>
  );
}