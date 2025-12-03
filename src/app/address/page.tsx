"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { 
  fetchCart
} from '../../lib/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getSessionId } from '@/lib/session';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface Address {
  id: string;
  name: string;
  address_line_1: string;
  email: string;
  mobile: string;
  default_address: number;
}

export default function Address() {
    const { data: session } = useSession(); // Use client-side session hook
    const dispatch = useAppDispatch();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const { items, total } = useAppSelector(state => state.cart); // Use typed selector
    const sessionId = getSessionId();
    const token = session?.user?.token || '';
    // console.log("items Count = ",items.length);
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
        
        //console.log('Cart loaded successfully:', result);
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };

    loadCartData();
  }, [dispatch, sessionId, token]);

  // Fetch address data
  useEffect(() => {
    const fetchAddress = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        //setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/default-shipping-address/${sessionId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const result = await response.json();
        setAddress(result.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [token]); // Added token as dependency

  if (loading) {
    return (
      <div className="index-page">
        <main className="main">
          <div className="d-flex justify-content-center mb-4 step-header">
            <div className="step-item ">
              <span className="step-number">1</span>
              <span className="step-label">Cart</span>
            </div>

            <div className="step-line"></div>

            <div className="step-item active">
              <span className="step-number">2</span>
              <span className="step-label">Address</span>
            </div>

            <div className="step-line"></div>

            <div className="step-item">
              <span className="step-number">3</span>
              <span className="step-label">Payment</span>
            </div>

            <div className="step-line"></div>

            <div className="step-item">
              <span className="step-number">4</span>
              <span className="step-label">Summary</span>
            </div>
          </div>
          <div className="container text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="index-page">
      <main className="main">
        <div className="d-flex justify-content-center mb-4 step-header">
          <div className="step-item ">
            <span className="step-number">1</span>
            <span className="step-label">Cart</span>
          </div>

          <div className="step-line"></div>

          <div className="step-item active">
            <span className="step-number">2</span>
            <span className="step-label">Address</span>
          </div>

          <div className="step-line"></div>

          <div className="step-item">
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
            <div className="row">
              <div className="col-lg-7">
                <div className="checkout-container aos-init aos-animate" data-aos="fade-up">
                  <form className="checkout-form">
                    <div className="section-header">
                      <div className="add-address d-flex flat-title flex-row justify-content-between align-items-center">
                        <h5>Select Address</h5>
                        <Link href="/add-address" className="btn btn-primary btn-sm mb-4 text-white" prefetch={false}>
                          <i className="bi bi-plus-lg"></i> Add Address
                        </Link>
                      </div>
                    </div>
                    <div className="account">
                      <div className="addresses-grid w-100">
                        {address ? (
                          <div className="address-card aos-init aos-animate active w-100" data-aos="fade-up" data-aos-delay="200">
                            <div className="card-header">
                              <h4>{address.name}</h4>
                            </div>
                            <div className="card-body">
                              <p className="address-text"><i className="bi bi-geo-alt"></i> {address.address_line_1}</p>
                              <div className="contact-info">
                                <div><i className="bi bi-envelope"></i> {address.email}</div>
                                <div><i className="bi bi-telephone"></i> {address.mobile}</div>
                              </div>
                              <Link href="/user/my-address/" className="btn btn-primary btn-sm mt-3 text-white" prefetch={false}>
                                <i className="bi bi-geo-alt"></i> Change Address
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p>No address found</p>
                            <Link href="/add-address" className="btn btn-primary text-white" prefetch={false}>
                              Add Your First Address
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Rest of your JSX remains the same */}
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
                                {/* <div className="cart">
                                    <div className="cart-summary">
                                        <div className="checkout-button">
                                            <Link href="/checkout" className="btn btn-accent text-white w-100">
                                                Proceed to Checkout <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>

                                        <div className="continue-shopping">
                                            <Link href="#" className="btn btn-link w-100">
                                                <i className="bi bi-arrow-left"></i> Continue Shopping
                                            </Link>
                                        </div>
                                    </div>
                                </div> */}
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
                </>
                )}
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
                  <Link href="/checkout" className="btn btn-primary process-to-checkout" prefetch={false}>
                    Proceed to Checkout <i className="bi bi-arrow-right"></i>
                  </Link>
                ) : (
                  <Link href="/login" className="btn btn-primary" prefetch={false}>
                    Proceed to Checkout <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          )}
      </main>
    </div>    
  );
}