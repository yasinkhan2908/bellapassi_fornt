'use client';
import Link from 'next/link';
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

//
export default function Checkout() {
  const router = useRouter(); // ✅ initialize router
  
  return (   
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Checkout</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">Checkout</li>
              </ol>
            </nav>
          </div>
        </div>  
        <section id="checkout" className="checkout section">
        <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
            <form id="OrderPlace" action="" method="post">
                <div className="row">                
                    <div className="col-lg-7">
                        <div className="checkout-container aos-init aos-animate" data-aos="fade-up">
                            <div className="checkout-section" id="payment-method">
                                <div className="section-header">
                                    <h3>Payment Method</h3>
                                </div>
                                <div className="section-content">
                                    <div className="payment-options">
                                        <div className="payment-option active">
                                            <input type="radio" name="paymentMode" id="credit-card" value="cod" />
                                            <label>
                                                <span className="payment-icon"><i className="bi bi-credit-card-2-front"></i></span>
                                                <span className="payment-label">Cash On Delivery (COD)</span>
                                            </label>
                                        </div>
                                        <div className="payment-option">
                                            <input type="radio" name="paymentMode" id="razorpay" value="razorpay"/>
                                            <label>
                                                <span className="payment-icon"><i className="bi bi-credit-card"></i></span>
                                                <span className="payment-label">Debit\ Credit Card\ Net Banking\ Wallets</span>
                                            </label>
                                        </div>
                                    </div>


                                    <div className="payment-details d-none" id="paypal-details">
                                        <p className="payment-info">You will be redirected to PayPal to complete your purchase securely.</p>
                                    </div>

                                    <div className="payment-details d-none" id="apple-pay-details">
                                        <p className="payment-info">You will be prompted to authorize payment with Apple Pay.</p>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="order-summary aos-init aos-animate" data-aos="fade-left" data-aos-delay="200">
                            <div className="order-summary-header">
                                <h3>Order Summary</h3>
                                <span className="item-count">2 Items</span>
                            </div>

                            <div className="order-summary-content">
                                <div className="order-items">
                                    <div className="order-item">
                                        <a target="_blank" href="" className="sc-product-thumb">  
                                            <div className="order-item-image">
                                                <Image height={40} width={40} src="/img/51.webp" alt="Product" className="img-fluid" />
                                            </div>
                                        </a>
                                                                                                                                                                              <div className="order-item-details">
                                                <h4>Printed, Daily wear, Georgette Saree with unstitched blouse piece</h4>
                                                <p className="order-item-variant">Size: Free</p>
                                                <div className="order-item-price">
                                                    <span className="quantity">1 ×</span>
                                                    <span className="price">₹ 570</span>
                                                </div>
                                            </div>
                                        </div>
                                                                                                                                                                              <div className="order-item">
                                            <a target="_blank" href="3" className="sc-product-thumb">  
                                                <div className="order-item-image">
                                                    <Image height={40} width={40} src="/img/52.webp" alt="Product" className="img-fluid"/>
                                                </div>
                                            </a>
                                                                                                                                                                                <div className="order-item-details">
                                                <h4>Printed, Daily wear, Georgette Saree with unstitched blouse piece</h4>
                                                <p className="order-item-variant">Size: Free</p>
                                                <div className="order-item-price">
                                                    <span className="quantity">1 ×</span>
                                                    <span className="price">₹ 475</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="order-totals">
                                        <div className="order-subtotal d-flex justify-content-between">
                                            <span>Subtotal</span>
                                            <span>₹ 1045</span>
                                        </div>
                                        <div className="order-total d-flex justify-content-between">
                                            <span>Total</span>
                                            <span>₹ 1045</span>
                                        </div>
                                    </div>
                                
                                    <div className="checkout-section" id="order-review">
                                        <div className="section-content">
                                            <div className="form-check terms-check">
                                                <input className="form-check-input" type="checkbox" id="terms" name="terms" />
                                                <label className="form-check-label">
                                                    I agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">Terms and Conditions</a> and <a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal">Privacy Policy</a>
                                                </label>
                                            </div>
                                            <div className="success-message d-none">Your order has been placed successfully! Thank you for your purchase.</div>
                                            <div className="place-order-container">
                                                <button type="button" className="btn btn-primary place-order-btn text-white" id="cod_payment">
                                                    <span className="btn-text text-white">Place Order</span>
                                                    <span className="btn-price text-white">₹ 1045</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="secure-checkout">
                                        <div className="secure-checkout-header">
                                            <i className="bi bi-shield-lock"></i>
                                            <span>Secure Checkout</span>
                                        </div>
                                        <div className="payment-icons">
                                            <i className="bi bi-credit-card-2-front"></i>
                                            <i className="bi bi-credit-card"></i>
                                            <i className="bi bi-paypal"></i>
                                            <i className="bi bi-apple"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            

                <div className="modal fade" id="termsModal" aria-labelledby="termsModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="termsModalLabel">Terms and Conditions</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                                <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                                <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="privacyModal" aria-labelledby="privacyModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="privacyModalLabel">Privacy Policy</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
                                <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                                <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
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