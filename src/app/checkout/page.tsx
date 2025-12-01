'use client';
import Link from 'next/link';
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  fetchCart
} from '../../lib/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getSessionId } from '@/lib/session';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, SetStateAction, useEffect, useState } from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import router from 'next/router';
import Swal from 'sweetalert2';
//
export default function Checkout() {
    const { data: session } = useSession(); // Use client-side session hook
    const dispatch = useAppDispatch();
    const { items, total } = useAppSelector(state => state.cart); // Use typed selector
    const sessionId = getSessionId();
    const token = session?.user?.token || '';
    const [paymentMode, setPaymentMode] = useState("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // console.log("items Count = ",items.length);
    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setPaymentMode(e.target.value);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsSubmitting(true);
    
        // try {
          //console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add-shipping-address`);
    
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/place-order`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`, // include login token
              },
              body: JSON.stringify({"session_id":sessionId,"paymentMode":paymentMode}),
          });
    
          const resresult = await response.json();
          
          //console.log("place Order",resresult.orderid);
          if (!resresult.status) {
            throw new Error(resresult.message || 'Something went wrong!');
          }
    
    
          Swal.fire({
              title: 'Success',
              text: resresult.message || 'Your order successfully place!',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#2ee44cff',
              cancelButtonColor: 'rgba(222, 41, 50, 1)',
              confirmButtonText: 'Ok'
          }).then(async (result: {
              [x: string]: any; isConfirmed: any; 
}) => {
              if (result.isConfirmed) {
                router.push(`/thanks?id=${resresult.orderid}`);

              }
          });
          
        // } catch (error) {
        //   Swal.fire({
        //     title: 'Error',
        //     text: error instanceof Error ? error.message : 'Failed. Please try again.',
        //     icon: 'error',
        //     confirmButtonText: 'OK'
        //   });
        // } finally {
        //   setIsSubmitting(false);
        // }
      };
    // Load cart data
    useEffect(() => {
        const loadCartData = async () => {
        if (!token) return;
        
        try {
            const result = await dispatch(
            fetchCart({
                session_id: sessionId,
                token: token,
            })
            ).unwrap();
            
            console.log('Cart loaded successfully:', result);
        } catch (err) {
            console.error('Failed to load cart:', err);
        }
        };

        loadCartData();
    }, [dispatch, sessionId, token]);
  
  return (   
    <div className="index-page">
        {items.length === 0 ? (
                  <div className='w-100 empty-cart text-center'>
                    <div className='cart-icon'>
                      <i className='bi bi-cart'></i>
                    </div>
                    <div className='empty-cart-text'>
                      No items found in cart to checkout
                    </div>
                    <div className='cart-continue-shopping'>
                      <Link href={'/'} className='btn btn-primary' prefetch={false}>Continue Shopping</Link>
                    </div>
                  </div>
                ) : (
                  <>
        <main className="main">
        <div className="d-flex justify-content-center mb-4 step-header">
          <div className="step-item ">
            <span className="step-number">1</span>
            <span className="step-label">Cart</span>
          </div>

          <div className="step-line"></div>

          <div className="step-item ">
            <span className="step-number">2</span>
            <span className="step-label">Address</span>
          </div>

          <div className="step-line"></div>

          <div className="step-item active">
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>

          <div className="step-line"></div>

          <div className="step-item">
            <span className="step-number">4</span>
            <span className="step-label">Summary</span>
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
                                                <input type="radio" name="paymentMode" id="credit-card" value="cod" checked={paymentMode === "cod"}
          onChange={(e) => setPaymentMode(e.target.value)}/>
                                                <label>
                                                    <span className="payment-icon"><i className="bi bi-credit-card-2-front"></i></span>
                                                    <span className="payment-label">Cash On Delivery (COD)</span>
                                                </label>
                                            </div>
                                            {/* <div className="payment-option">
                                                <input type="radio" name="paymentMode" id="razorpay" value="razorpay"/>
                                                <label>
                                                    <span className="payment-icon"><i className="bi bi-credit-card"></i></span>
                                                    <span className="payment-label">Debit\ Credit Card\ Net Banking\ Wallets</span>
                                                </label>
                                            </div> */}
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

                        {/* Rest of your JSX remains the same */}
                
                    <div className="col-lg-5">
                        <div className="order-summary aos-init aos-animate" data-aos="fade-left" data-aos-delay="200">
                            
                            <div className="order-summary-header">
                                <h3>Order Summary</h3>
                                <span className="item-count">{items.length} Items</span>
                            </div>
                            
                            

                            <div className="order-summary-content">
                                <div className="order-items">
                                    {items.map((item: { 
                                product: { 
                                    product_image: { image: string | StaticImport; }; 
                                    product_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; 
                                    price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; 
                                }; 
                                size: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; 
                                id: any; 
                                quantity: number; 
                                }) => (
                                    <div className="order-item">
                                        <Link target="_blank" href="" className="sc-product-thumb" prefetch={false}>  
                                            <div className="order-item-image">
                                                <Image height={40} width={40} loading='lazy' src={item?.product?.product_image?.image ?? ''} alt={item.product.product_name as string} className="img-fluid"/>
                                            </div>
                                        </Link>
                                        <div className="order-item-details">
                                            <h4>{item.product.product_name}</h4>
                                            <p className="order-item-variant">Size: {item.size}</p>
                                            <div className="order-item-price">
                                                <span className="quantity">{item.quantity} ×</span>
                                                <span className="price">₹ {item.product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>


                                <div className="order-totals">
                                    <div className="order-subtotal d-flex justify-content-between">
                                        <span>Subtotal</span>
                                        <span>₹ {total.toFixed(2)}</span>
                                    </div>
                                    <div className="order-subtotal d-flex justify-content-between">
                                        <span>Tax</span>
                                        <span>₹ 0.00</span>
                                    </div>
                                    <div className="order-subtotal d-flex justify-content-between">
                                        <span>Discount</span>
                                        <span>₹ 0.00</span>
                                    </div>
                                    <div className="order-total d-flex justify-content-between">
                                        <span>Total</span>
                                        <span>₹ {total.toFixed(2)}</span>
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
        {items.length > 0 && (
            <div className="add-to-cart-detail mt-1 text-center">
                <div className="detail-cart-btn">
                <button className="btn btn-primary buy-now-btn" type="button">
                    ₹ {total.toFixed(2)}
                </button>

                {token ? (
                    <button 
                        type="submit" 
                        className="btn btn-primary mt-3 checkout-btn" onClick={handleSubmit}
                        disabled={isSubmitting}
                        >
                        Place Order <i className="bi bi-arrow-right"></i>
                        </button>
                ) : (
                    <Link href="/login" className="btn btn-primary checkout-btn" prefetch={false}>
                        Place Order <i className="bi bi-arrow-right"></i>
                    </Link>
                )}
                </div>
            </div>
            )}  
        </main>    
        </>
                )}    
    </div>
        
  );
}
