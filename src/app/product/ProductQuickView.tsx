"use client";

import { useState, useRef, Key, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import { Modal, Button } from "react-bootstrap";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type Product = {
  [x: string]: any;
  id: number;
  slug: string;
  name: string;
  price: number;
  discount_price:number;
  image: string;
  description: string;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductQuickView({ product }: ProductCardProps) {
    const [show, setShow] = useState(false);
    //console.log("quick view products",product.attributes);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
        const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
        const [isZoomed, setIsZoomed] = useState(false);
        const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
        const mainImageRef = useRef<HTMLDivElement>(null);
    
        // const images = [
        //     {
        //         id: '3',
        //         src: '/img/collection-26.jpg',
        //         alt: 'Sample Product 3',
        //         width: 800,
        //         height: 600,
        //     },
        //     {
        //         id: '4',
        //         src: '/img/collection-27.jpg',
        //         alt: 'Sample Product 4',
        //         width: 800,
        //         height: 600,
        //     },
        //     {
        //         id: '5',
        //         src: '/img/collection-28.jpg',
        //         alt: 'Sample Product 5',
        //         width: 800,
        //         height: 600,
        //     },
        // ];
        const images = product.productimages;
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

  if (!product) return null;

  return (
    <>
        <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
            <li className="icon mx-3" onClick={handleShow}><span className="bi bi-eye"></span></li>
            {/* <li className="icon mx-3"><span className="bi bi-heart"></span></li> */}
            <li className="icon"><span className="bi bi-cart"></span></li>
        </ul>

        <Modal show={show} onHide={handleClose} centered size="xl" >
            <Modal.Header closeButton>
                <Modal.Title>{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid rounded mb-3"
                />
                <p className="text-muted">{product.description}</p>
                <h5 className="fw-bold">${product.price}</h5> */}

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
                                        alt={product.product_name}
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
                                            alt={product.product_name}
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
                        <div className="quick-view-heading h2 mb-3">{product.product_name}</div>
                        <div className="mb-3">
                            <span className="h4 me-2 quick-view-price">₹  {product.price}</span>
                            <span className="text-muted text-decoration-line-through">₹ {product.mrp}</span>
                            <span className="badge bg-danger ms-2">{product.discount}% OFF</span>
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

                        <p className="mb-4">{product.short_description}</p>

                        <div className="mb-4">
                            <h6 className="mb-2">Size</h6>
                            <div className="size-options">
                                {product.attributes?.map((attr: { id: Key | null | undefined; size: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                                    <div key={attr.id} className="size-option" data-size="{attr.size}">{attr.size}</div>
                               ))}
                            </div>
                        </div>

                        <div className="product-quantity mb-4">
                            <h6 className="option-title">Quantity:</h6>
                            <div className="quantity-selector">
                            <button className="quantity-btn decrease">
                                <i className="bi bi-dash"></i>
                            </button>
                            <input type="number" className="quantity-input" value={1} min="1" max="24"/>
                            <button className="quantity-btn increase" >
                                <i className="bi bi-plus"></i>
                            </button>
                            </div>
                        </div>

            
                        <div className="detail-cart-btn d-flex gap-2">
                            <button className="btn btn-primary" type="button">
                                <i className="bi bi-cart mr-2"></i>Add to Cart
                            </button>
                            {/* <button className="btn btn-primary buy-now-btn" type="button">
                                <i className="bi bi-cart mr-2"></i>Buy Now
                            </button>
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="bi bi-heart me-2"></i>Add to Wishlist
                            </button> */}
                        </div>

            
                        <div className="mt-4">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-truck text-primary me-2"></i>
                                <span>Free shipping on orders over $50</span>
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
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="success">Add to Cart</Button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer> */}
        </Modal>
    </>
  );
}
