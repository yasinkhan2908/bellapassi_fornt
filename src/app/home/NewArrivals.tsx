'use client';
import Image from "next/image";
import { NewArrivalsProps } from '../../types';
import Link from "next/link";
import ProductQuickView from "../product/ProductQuickView";
//import ProductQuickView from "../products/ProductQuickView";
export const NewArrivals = ({ products }: NewArrivalsProps) => {
    // const products = [
    //     {
    //         id: 1,
    //         name: "Winter Cinnamon Brown Oversized",
    //         price: 899,
    //         discount_price: 999,
    //         image: "/img/308434-sss_vertical.webp",
    //         description: "Winter Cinnamon Brown Oversized.",
    //     },
    //     {
    //         id: 2,
    //         name: "Black Faux Leather Bomber Jacket",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/310829-sss_vertical.webp",
    //         description: "Black Faux Leather Bomber Jacket",
    //     },
    //     {
    //         id: 3,
    //         name: "Set Of 2- Full Sleeves Blazer with High Waist Trouser",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/271014-sss_vertical.webp",
    //         description: "Set Of 2- Full Sleeves Blazer with High Waist Trouser.",
    //     },
    //     {
    //         id: 4,
    //         name: "Deep Neck Red Bodycon Dress",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/274576-sss_vertical.webp",
    //         description: "Deep Neck Red Bodycon Dress.",
    //     },
    //     {
    //         id: 5,
    //         name: "Strapless Mini Leather Dress",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/308750-sss_vertical.webp",
    //         description: "Strapless Mini Leather Dress.",
    //     },
    //     {
    //         id: 6,
    //         name: "Red Bodycon Mini Dress",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/246752-sss_vertical.webp",
    //         description: "Red Bodycon Mini Dress.",
    //     },
    //     {
    //         id: 7,
    //         name: "Premium Limited Edition Long Boot - Brown",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/193060-vertical_default.webp",
    //         description: "Premium Limited Edition Long Boot - Brown.",
    //     },
    //     {
    //         id: 8,
    //         name: "Merlot Patent Bow Slingback Pumps",
    //         price: 899,
    //         discount_price : 999,
    //         image: "/img/299467-vertical_default.webp",
    //         description: "Merlot Patent Bow Slingback Pumps.",
    //     },
    // ];
    //console.log("new products",products);
  return (
    <section className="section mt-4" data-aos="fade-up">
        <div className="container">
            <div className="new-arrivel-heding">
                <h4 className="text-center m-0 p-0">New Arrivals</h4>
                <p className="text-center mt-2 p-0">Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
            </div>
            <div className="new-arrivel-products">
                <div className="row gx-sm-3 gx-0">
                    {products.map((product) => {
                            // 🎨 Generate a random color for each product image
                            // 🎨 Define your 8 light colors
                            const lightColors = [
                                "#f9c0c847", // light orange
                                "#e2faf9", // light blue
                                "#F8BBD0", // pink
                                "#FFF9C4", // light yellow
                                "#C8E6C9", // mint green
                                "#D1C4E9", // lavender
                                "#FFECB3", // light amber
                                "#B3E5FC", // sky blue
                            ];

                            // Pick a random color from the array
                            const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];
                            return (
                                <div
                                key={product.id}
                                className="col-lg-3 col-sm-6 col-6 px-product-item product-item my-3"
                                >
                                <div className="w-100 product-sec">
                                    <div className="product new-arrival-prd">
                                    <Link
                                        href={`/product/${product.slug}-${product.id}`}
                                        className="w-100"  prefetch={false}
                                    >
                                        <Image
                                        width={282}
                                        height={400}
                                        src={product.product_image.medium}
                                        alt={product.product_name}
                                        loading="lazy"
                                        style={{
                                            backgroundColor: randomColor, // 👈 Random color here
                                            objectFit: "cover",
                                        }}
                                        />
                                    </Link>
                                    
                                    <div className="rating-box">
                                        <span className="rating">4.5</span>
                                        <i className="bi bi-star-fill star-icon"></i>
                                        <span className="divider">|</span>
                                        <span className="count">20</span>
                                    </div>
                                    {/* <ProductQuickView product={product} /> */}
                                    </div>

                                    <Link
                                    href={`/product/${product.slug}-${product.id}`}
                                    className="w-100" prefetch={false}
                                    >
                                    <div className="product-name-dtl">
                                        <div className="title p-3 pb-1">
                                        {product.product_name}
                                        </div>
                                        <div className="d-flex py-1 price p-3 pt-0">
                                        <p className="mr-2 font-semibold mb-0">
                                            ₹ {product.price}
                                        </p>
                                        <p className="text-gray-600 line-through mb-0">
                                            ₹ {product.mrp}
                                        </p>
                                        </div>
                                    </div>
                                    </Link>
                                </div>
                                </div>
                            );
                            })}
                </div>
            </div>
        </div>
    </section>
  );
};