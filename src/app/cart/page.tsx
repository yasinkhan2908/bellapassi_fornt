'use client';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect } from "react";
import Swal from 'sweetalert2';

import { useSession } from "next-auth/react";
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart 
} from '../../lib/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'; // Use typed hooks
import { getSessionId } from '@/lib/session';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch(); // Use typed dispatch
  const { items, total, loading, error } = useAppSelector(state => state.cart); // Use typed selector
  console.log('cart items ; ',items);
  const session = useSession();
  const data = session?.data?.user.token ?? null;
  
  const sessionId = getSessionId();
  console.log("login Token", session?.data);
  var token = '';
  if(session?.data?.user?.token)
  {
    token = session?.data?.user?.token;
  }
  else{
    token = '';
  }
    
  

  const handleQuantityChange = (cartId: number, newQuantity: number) => {
    console.log("newQuantity : ", newQuantity);
    if (newQuantity < 1) return;
    
    // This should now work without TypeScript errors
    dispatch(
      updateCartItem({
        cartId: cartId,
        quantity: Number(newQuantity)
      })
    );
  };

  const handleRemoveItem = (cartId: number,session_id: string,token: string) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to remove this! ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ee44cff',
        cancelButtonColor: 'rgba(222, 41, 50, 1)',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result: { isConfirmed: any; }) => {
        if (result.isConfirmed) { 
            await dispatch(
                removeFromCart({
                    cartId: cartId,
                    session_id: session_id,
                    token: token
                })
            ).unwrap();  // waits for API success
            const result = await dispatch(
            fetchCart({
                session_id: sessionId,
                token: token,
            })
            ).unwrap();
            router.refresh(); 
            
        }
    });
    
  };

  useEffect(() => {
    const loadCartData = async () => {
      //if (!token) return;
      
      try {
        console.log(sessionId);
        console.log(token);
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
    <>
    <style jsx>{`
  footer {
    display: none !important;
  }
`}</style>
    <div className="index-page cart-page">
        <main className="main">
          
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
          <section id="cart" className="cart section">
            <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
              <div className="row g-4">
                <div className="d-flex justify-content-center mb-4 step-header">
                  <div className="step-item active">
                    <span className="step-number">1</span>
                    <span className="step-label">Cart</span>
                  </div>

                  <div className="step-line"></div>

                  <div className="step-item">
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


                    <div className="col-lg-8 aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="fw-bold">Shopping cart <span className="text-muted">({items.length} Items)</span></h4>
                    </div>
                    {items.map((item: {
                          product: {
                            mrp: ReactNode;
                            discount: ReactNode;
                            product_image: { image: string | StaticImport; };
                            product_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                            price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                          };
                          size: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
                          id: any;
                          quantity: number;
                        }) => (
                      <div key={item.id}  className="card p-3 mt-3 shadow-sm">
                        <div className="row align-items-center0">
                          <div className="col-md-2 col-4">
                              <Image height={575} width={862}  src={item?.product?.product_image?.image ?? ''} alt={item.product.product_name as string} className="img-fluid rounded"/>
                          </div>

                          <div className="col-md-6 col-8">
                            <div className="mb-1 fw-semibold cart-product-name">{item.product.product_name}</div>
                            <div className="d-flex align-items-center mb-1">
                                <span className="fs-5 fw-bold text-dark">₹ {item.product.price}</span>
                                <span className="text-decoration-line-through text-muted ms-2">₹ {item.product.mrp}</span>
                                <span className="badge bg-danger text-white ms-2">{item.product.discount}% off</span>
                            </div>
                            

                            <div className="d-flex gap-3">
                                <div>
                                    <label className="form-label small mb-1 w-100">Size</label>
                                    <span className='cart-size-show'>{item.size}</span>
                                </div>

                                <div>
                                    <label className="form-label small mb-1 w-100">Qty</label>
                                    <div className="quantity-selector">
                                      <button
                                        className="quantity-btn decrease"
                                        onClick={() => handleQuantityChange(item.id, Number(item.quantity) - Number(1))}
                                        disabled={item.quantity <= 1}
                                      >
                                        <i className="bi bi-dash"></i>
                                      </button>
                                      <input
                                        type="number"
                                        className="quantity-input"
                                        value={item.quantity}
                                        min="1"
                                        max="10"
                                        readOnly />
                                      <button
                                        className="quantity-btn increase"
                                        onClick={() => handleQuantityChange(item.id, Number(item.quantity) + Number(1))}
                                      >
                                        <i className="bi bi-plus"></i>
                                      </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                          <div className="col-md-4 text-end mt-3 mt-md-0">
                              <span className="cart-product-remove" onClick={() => handleRemoveItem(item.id, sessionId, token)}>
                                <FontAwesomeIcon icon={faXmark} className="text-red-500 text-2xl ms-4"/>
                              </span>
                          </div>
                        </div>
                      </div>
                    ))}  
                      
                    </div>

                    <div className="col-lg-4 aos-init aos-animate" data-aos="fade-up" data-aos-delay="300">
                      <h4 className="summary-title mb-4">Order Summary</h4>
                      <div className="cart-summary mb-3">                        
                        <div className="cart-detail">
                          <div className="summary-item">
                            <div className="w-100">
                              <div className="coupons-base-header">Coupons</div>
                              <div className="coupons-base-content">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="coupons-base-couponIcon"><g fill="none" fill-rule="evenodd" transform="rotate(45 6.086 5.293)"><path stroke="#000" d="M17.5 10V1a1 1 0 0 0-1-1H5.495a1 1 0 0 0-.737.323l-4.136 4.5a1 1 0 0 0 0 1.354l4.136 4.5a1 1 0 0 0 .737.323H16.5a1 1 0 0 0 1-1z"></path><circle cx="5.35" cy="5.35" r="1.35" fill="#000" fill-rule="nonzero"></circle></g></svg>
                                <div className="coupons-base-label ">Apply Coupons</div>
                                <button font-size="body3" font-weight="bold" role="button" className="css-15k6cs5">
                                  <div className="css-xjhrni">APPLY</div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="cart-summary mt-2">                        
                        <div className="cart-detail">
                          <div className="summary-item">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value">₹ {total.toFixed(2)}</span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Tax</span>
                            <span className="summary-value">₹ 0.00</span>
                          </div>
                          <div className="summary-item discount">
                            <span className="summary-label">Discount</span>
                            <span className="summary-value">₹ 0.00</span>
                          </div>
                          <div className="summary-total">
                            <span className="summary-label">Total</span>
                            <span className="summary-value">₹ {total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                          
                        
                        <div className="payment-methods">
                          <p className="payment-title">We Accept</p>
                          <div className="payment-icons">
                            <i className="bi bi-credit-card-2-front"></i>
                            <i className="bi bi-paypal"></i>
                            <i className="bi bi-wallet2"></i>
                            <i className="bi bi-apple"></i>
                            <i className="bi bi-google"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  
              </div>
            </div>
          </section>
          </>
          )}
        </main>
        
        {items.length > 0 && (
          <div className="add-to-cart-detail mt-1 text-center">
            <div className="detail-cart-btn">
              <button className="btn btn-primary buy-now-btn" type="button">
                ₹ {total.toFixed(2)}
              </button>

              {token ? (
                <Link href="/address" className="btn btn-primary process-to-checkout" prefetch={false}>
                  Proceed to Checkout <i className="bi bi-arrow-right"></i>
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary" prefetch={false} style={{ marginBottom: 10 }}>
                  Proceed to Checkout <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
      </>
  );
}