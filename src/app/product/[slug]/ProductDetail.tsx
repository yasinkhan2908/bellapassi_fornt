"use client";
import { useState, useEffect, SetStateAction,useRef, Key, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import Link from 'next/link';
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
export interface Product {
  [x: string]: any;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
import { Nav, Tab, Tabs } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import toast from 'react-hot-toast';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import { useAppDispatch } from "../../../lib/hooks";
import { increment, decrement } from '@/lib/slices/counterSlice';
import { addToCart, fetchCart } from '@/lib/slices/cartSlice';
import { getSessionId } from "@/lib/session";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";

interface ImageGalleryProps {
  images: {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
}
// 2️⃣ Type the props using that interface
interface ProductDetailProps {
  product: Product;
}
 
// 3️⃣ Apply the type in your component
export default function ProductDetail({ product }: ProductDetailProps) {
    const [quantity, setQuantity]         = useState(1);
    const dispatch                        = useAppDispatch();
    const router = useRouter();
    const session = useSession();
    const data = session?.data?.user.token ?? null;

    // console.log("product data : ",product);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [mainSwiper, setMainSwiper]     = useState<SwiperType | null>(null);
    const [isZoomed, setIsZoomed]         = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const mainImageRef                    = useRef<HTMLDivElement>(null);
    const productdetail                   = product.data.productdetails;
    const images                          = productdetail.productimages;
    const [size, setSize]                 = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);

    //add to cart data
    const productId  = productdetail.id;
    let categoryId   = '';
    if (productdetail.sub_sub_sub_category_id) {
        categoryId = productdetail.sub_sub_sub_category_id;
    }
    else if (productdetail.sub_sub_category_id) {
        categoryId = productdetail.sub_sub_category_id;
    }
    else if (productdetail.sub_category_id) {
        categoryId = productdetail.sub_category_id;
    }
    else {
        categoryId = productdetail.category_id;
    }
    const sessionId = getSessionId();
    //console.log("sessionId",sessionId);
    const handleAddToCart = async () => {
        if (!size) {
            const modalElement = document.getElementById("sizeModal");
            if (modalElement) {
                // get existing instance or create it once
                const modal = bootstrap.Modal.getInstance(modalElement)
                            || new bootstrap.Modal(modalElement);
                modal.show();
            }
            return;
        }

        setIsLoading(true);

        await dispatch(
            addToCart({
                product_id: productdetail.id,
                category_id: productdetail.category_id,
                size: size,
                quantity: quantity,
                session_id: sessionId,
                token: session?.data?.user?.token,
            })
        ).unwrap();

        // <-- hide after success
        const modalElement = document.getElementById("sizeModal");
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }

        toast.success("Added to cart");
        router.refresh();

        await dispatch(
            fetchCart({
                session_id: sessionId,
                token: session?.data?.user?.token,
            })
        ).unwrap();

        setIsLoading(false);
        setInCart(true);
    };



    const increaseQty = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQty = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleSizeClick = (value: SetStateAction<undefined>) => {
        setSize(value);
        setInCart(false);  
    };

    

    const handleBlankSizeClick = (value: SetStateAction<undefined>) => {
        setSize(value);
        //setInCart(false);
        setTimeout(() => {
            handleAddToCart();
        }, 1000);
    };

    //console.log("product quantity",quantity);

    const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !mainImageRef.current) return;

        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
        });
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };
  return (
    <div className="index-page">
        <main className="main">
            <section id="product-details" className="product-details section">
                <div className="container aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="max-w-6xl mx-auto p-0">
                                {/* Main Image Slider */}
                                <div className="relative mb-4">
                                    <Swiper
                                    modules={[Navigation, Thumbs, Zoom]}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    navigation
                                    zoom={true}
                                    onSwiper={setMainSwiper}
                                    className="main-swiper"
                                    >
                                    {images.map((image: {
                                        medium: string | StaticImport; id: Key | null | undefined; src: string | StaticImport; alt: string; 
    }) => (
                                        <SwiperSlide key={image.id}>
                                        <div 
                                            ref={mainImageRef}
                                            className="swiper-zoom-container relative cursor-zoom-in product-detail-zoom"
                                            onClick={toggleZoom}
                                            onMouseMove={handleImageMouseMove}
                                            style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                                        >
                                            <Image
                                            src={image.medium}
                                            alt={productdetail.product_name}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-contain"
                                            style={{
                                                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                transition: 'transform 0.3s ease',
                                            }} loading="lazy"
                                            />
                                            {isZoomed && (
                                            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                                                Click to zoom out
                                            </div>
                                            )}
                                        </div>
                                        </SwiperSlide>
                                    ))}
                                    </Swiper>
                                </div>

                                {/* Thumbnail Slider */}
                                <div className="relative">
                                    <Swiper
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    onSwiper={setThumbsSwiper}
                                    spaceBetween={10}
                                    slidesPerView={5}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    breakpoints={{
                                        320: {
                                        slidesPerView: 3,
                                        },
                                        640: {
                                        slidesPerView: 4,
                                        },
                                        1024: {
                                        slidesPerView: 5,
                                        },
                                    }}
                                    className="thumb-swiper"
                                    >
                                    {images.map((image: {
                                        [x: string]: string | StaticImport; id: string; src: string | StaticImport; alt: string; 
    }, index: number) => (
                                        <SwiperSlide id={image.id} key={image.id}>
                                            <div
                                                className={`relative block w-full h-20 border-2 rounded-lg overflow-hidden product-detail-swipe transition-all ${
                                                mainSwiper?.activeIndex === index 
                                                    ? 'border-blue-500 border-2' 
                                                    : 'border-gray-300'
                                                }`}
                                                onClick={() => mainSwiper?.slideTo(index)}
                                            >
                                                <Image
                                                src={image.medium}
                                                alt={productdetail.product_name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 80px, 100px" loading="lazy"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    </Swiper>
                                </div>
                            </div>

                        </div>

        
                        <div className="col-md-6">
                            <h1 className="h2 mb-3">{productdetail.product_name}</h1>
                            <div className="mb-3">
                                <span className="h4 me-2">₹ {productdetail.price}</span>
                                <span className="text-muted text-decoration-line-through">₹ {productdetail.mrp}</span>
                                <span className="badge bg-danger ms-2">{productdetail.discount}% OFF</span>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="text-warning me-2">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                    <span className="text-muted">(0 reviews)</span>
                                </div>
                            </div>

                            <p className="mb-4">{productdetail.short_description}</p>

                            <div className="mb-4">
                                <h6 className="mb-2">Size</h6>
                                <div className="size-options">
                                    {productdetail.attributes?.map((attr: any) => (
                                        <div
                                        key={attr.id}
                                        className={`size-option ${size === attr.size ? "active" : ""}`}
                                        onClick={() => handleSizeClick(attr.size)}
                                        >
                                        {attr.size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
                                <div className="modal fade" id="sizeModal" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">

                                        <div className="modal-header">
                                            {/* <h5 className="modal-title">Select Size</h5> */}
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>

                                        <div className="modal-body">
                                            <p>Please select a size before adding the product to your cart.</p>

                                            <div className="size-options">
                                                {productdetail.attributes?.map((attr: any) => (
                                                    <div
                                                    key={attr.id}
                                                    className={`size-option ${size === attr.size ? "active" : ""}`}
                                                    onClick={() => handleBlankSizeClick(attr.size)}
                                                    >
                                                    {attr.size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* <div className="modal-footer">
                                            <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            >
                                            OK
                                            </button>
                                        </div> */}

                                        </div>
                                    </div>
                                </div>

                            


                            {/* <div className="product-quantity mb-4">
                                <h6 className="option-title">Quantity:</h6>
                                <div className="quantity-selector">
                                <button className="quantity-btn decrease" onClick={decreaseQty}>
                                    <i className="bi bi-dash"></i>
                                </button>
                                <input type="number" className="quantity-input" min="1" max="24" value={quantity} readOnly/>
                                <button className="quantity-btn increase" onClick={increaseQty}>
                                    <i className="bi bi-plus"></i>
                                </button>
                                </div>
                            </div> */}

                
                            {/* <div className="detail-cart-btn d-flex gap-2">
                                <button className="btn btn-primary" type="button">
                                    <i className="bi bi-cart mr-2"></i>Add to Cart
                                </button>
                                <button className="btn btn-primary buy-now-btn" type="button">
                                    <i className="bi bi-cart mr-2"></i>Buy Now
                                </button>
                                <button className="btn btn-outline-secondary" type="button">
                                    <i className="bi bi-heart me-2"></i>Add to Wishlist
                                </button>
                            </div> */}

                
                            <div className="mt-4">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-truck text-primary me-2"></i>
                                    <span>Free shipping on orders over ₹ 50</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-arrow-repeat text-primary me-2"></i>
                                    <span>30-day return policy</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-shield text-primary me-2"></i>
                                    <span>2-year warranty</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 mb-5">
                        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                            <Tab eventKey="home" title="Description">
                                <div className="product-description mb-5">
                                    <h4>Product Overview</h4>
                                    <p>{productdetail.description}</p>
                                </div>
                            </Tab>
                            <Tab eventKey="profile" title="Specifications">
                                <div className="product-specifications mb-5">
                                    <div className="specs-group">
                                    <h4>Technical Specifications</h4>
                                    <div className="specs-table">
                                        <div className="specs-row">
                                            <div className="specs-label">Connectivity</div>
                                            <div className="specs-value">Bluetooth 5.0, 3.5mm jack</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Battery Life</div>
                                            <div className="specs-value">Up to 30 hours</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Charging Time</div>
                                            <div className="specs-value">3 hours</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Driver Size</div>
                                            <div className="specs-value">40mm</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Frequency Response</div>
                                            <div className="specs-value">20Hz - 20kHz</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Impedance</div>
                                            <div className="specs-value">32 Ohm</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Weight</div>
                                            <div className="specs-value">250g</div>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="specs-group">
                                    <h4>Features</h4>
                                    <div className="specs-table">
                                        <div className="specs-row">
                                            <div className="specs-label">Noise Cancellation</div>
                                            <div className="specs-value">Active Noise Cancellation (ANC)</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Controls</div>
                                            <div className="specs-value">Touch controls, Voice assistant</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Microphone</div>
                                            <div className="specs-value">Dual beamforming microphones</div>
                                        </div>
                                        <div className="specs-row">
                                            <div className="specs-label">Water Resistance</div>
                                            <div className="specs-value">IPX4 (splash resistant)</div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </section>
        </main>
        <div className="add-to-cart-detail mt-1 text-center">
            <div className="detail-cart-btn">
                {/* <button className="btn btn-primary" type="button" onClick={() => handleAddToCart()} disabled={isLoading}>
                    <i className="bi bi-cart mr-2"></i>
                    {isLoading ? (
                        <>
                          Processing...
                        </>
                      ) : 'Add to Cart'}
                    
                </button> */}
                {inCart ? (
                    <button 
                        className="btn btn-primary" 
                        onClick={() => router.push("/cart")}
                    >
                       <i className="bi bi-cart mr-2"></i> Go to Cart
                    </button>
                    ) : (
                    <button className="btn btn-primary" type="button" onClick={() => handleAddToCart()} disabled={isLoading}>
                    <i className="bi bi-cart mr-2"></i>
                        {isLoading ? (
                            <>
                            Processing...
                            </>
                        ) : 'Add to Cart'}
                        
                    </button>
                    )}
                {/* <button className="btn btn-primary buy-now-btn" type="button">
                    <i className="bi bi-cart mr-2"></i>Buy Now
                </button>
                <button className="btn btn-outline-secondary" type="button">
                    <i className="bi bi-heart me-2"></i>Add to Wishlist
                </button> */}
            </div>
        </div>
        {/* <Footer /> */}
    </div>
  );
}
