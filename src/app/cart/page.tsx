'use client';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect } from "react";
import Swal from 'sweetalert2';

import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart 
} from '../../lib/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'; // Use typed hooks
import { getSessionId } from '@/lib/session';
import { useSession } from 'next-auth/react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export default function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch(); // Use typed dispatch
  const { items, total, loading, error } = useAppSelector(state => state.cart); // Use typed selector

  const session = useSession();
  const data = session?.data?.user.token ?? null;
  
  const sessionId = getSessionId();
  console.log("sessionId", sessionId);
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
        quantity: newQuantity
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
    <section id="cart" className="cart section">
      <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4">
          {items.length === 0 ? (
            <div className='w-100 empty-cart text-center'>
                <div className='cart-icon'>
                    <i className='bi bi-cart'></i>
                </div>
                <div className='empty-cart-text'>
                    No items found in cart to checkout
                </div>
                <div className='cart-continue-shopping'>
                    <Link href={'/'} className='btn btn-primary'>Continue Shopping</Link>
                </div>
            </div>
          ) : (
            <>
              <div className="col-lg-8 aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                <div className="cart-items">
                  <div className="cart-header d-none d-lg-block">
                    <div className="row align-items-center gy-4">
                      <div className="col-lg-6">
                        <h5>Product</h5>
                      </div>
                      <div className="col-lg-2 text-center">
                        <h5>Price</h5>
                      </div>
                      <div className="col-lg-2 text-center">
                        <h5>Quantity</h5>
                      </div>
                      <div className="col-lg-2 text-center">
                        <h5>Total</h5>
                      </div>
                    </div>
                  </div>
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
                    <div key={item.id} className="cart-item aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                      <div className="row align-items-center gy-4">
                        <div className="col-lg-6 col-12 mb-3 mb-lg-0">
                          <div className="product-info d-flex align-items-center">
                            <div className="product-image">
                              <Image height={40} width={40} src={item.product.product_image.image} alt={item.product.product_name as string} className="img-fluid" loading="lazy" />
                            </div>
                            <div className="product-details">
                              <h6 className="product-title">{item.product.product_name}</h6>
                              <div className="product-meta">
                                <span className="product-size">Size: {item.size}</span>
                              </div>
                              <button 
                                className="remove-item btn btn-danger" 
                                type="button"
                                onClick={() => handleRemoveItem(item.id,sessionId,token)}
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 text-center">
                          <div className="price-tag">
                            <span className="current-price">₹ {item.product.price}</span>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 text-center">
                          <div className="quantity-selector">
                            <button 
                              className="quantity-btn decrease" 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
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
                              readOnly
                            />
                            <button 
                              className="quantity-btn increase" 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                        <div className="col-12 col-lg-2 text-center mt-3 mt-lg-0">
                          <div className="item-total mt-4">
                            <span>₹ {(item.quantity * Number(item.product.price)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>                                
                  ))}
                </div>
                <div className="cart-actions">
                  <div className="row g-3">
                    <div className="col-lg-6 col-md-6">
                      <div className="coupon-form">
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Coupon code"/>
                          <button className="btn btn-accent" type="button">Apply</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 text-md-end">
                      <button className="btn btn-outline-danger">
                        <i className="bi bi-trash"></i> Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 aos-init aos-animate" data-aos="fade-up" data-aos-delay="300">
                <div className="cart-summary">
                  <h4 className="summary-title">Order Summary</h4>
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
                    <span className="summary-value">-₹ 0.00</span>
                  </div>
                  <div className="summary-total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">₹ {total.toFixed(2)}</span>
                  </div>
                  <div className="checkout-button">
                    <Link href="/address" className="btn btn-accent text-white w-100">
                      Proceed to Checkout <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                  <div className="continue-shopping">
                    <Link href="/products" className="btn btn-link text-white w-100">
                      <i className="bi bi-arrow-left"></i> Continue Shopping
                    </Link>
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
            </>
          )}
        </div>
      </div>  
    </section>    
  );
}