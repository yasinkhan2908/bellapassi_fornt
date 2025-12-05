"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductQuickView from "../product/ProductQuickView";
import type { Product } from "@/types";
const truncate = (text: string, max: number) => 
text.length > max ? text.slice(0, max) + "..." : text;

interface SearchPageProps {
  categoryName: string;
  initialProducts: Product[];
  bgColor: string[];
  query:string;
  initialPage: number;
  lastPage: number;
}

const DEBOUNCE_DELAY = 300;

export default function SearchPage({
  categoryName,
  initialProducts,
  bgColor,
  query,
  initialPage,
  lastPage,
}: SearchPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < lastPage);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState(initialProducts);
  const loadingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const handleScroll = async () => {
      
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !loading && hasMore) {
        setLoading(true);
        const nextPage = page + 1;
        try {
          //console.log("nextPage",nextPage);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/search-products/${query}?page=${nextPage}`, {
            cache: 'no-store',
          });
          const json = await res.json()
          const product = Array.isArray(json) ? json : json.data.products;
          //console.log("category scrolling products",product.data);
          setAllProducts((prev) => [...prev, ...product.data]);
          setPage(product.current_page);
          setHasMore(product.current_page < product.last_page);
        } catch (err) {
          console.error("Error loading more products:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categoryName, page, hasMore, loading]);

  // const handleScroll = useCallback(() => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }

  //   timerRef.current = setTimeout(() => {
  //     const scrollTop = window.scrollY;
  //     const windowHeight = window.innerHeight;
  //     const documentHeight = document.documentElement.scrollHeight;
  //     const scrollThreshold = 200; // Load when 200px from bottom

  //     if (documentHeight - (scrollTop + windowHeight) < scrollThreshold) {
  //       loadMoreProducts();
  //     }
  //   }, DEBOUNCE_DELAY);
  // }, [loadMoreProducts]);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, [handleScroll]);

  
  useEffect(() => {
    //setProducts(initialProducts);
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getRandomColor = () => {
    const colors = bgColor.length > 0 ? bgColor : ['#f9c0c847', '#e2faf9'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background mb-3">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">{query} </h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Search </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          {/* Product Grid */}
          <div className="row gx-sm-3 gx-0">
            {allProducts.map((product) => {
              // const lightColors = [
              //   "#f9c0c847",
              //   "#e2faf9",
              //   "#F8BBD0",
              //   "#FFF9C4",
              //   "#C8E6C9",
              //   "#D1C4E9",
              //   "#FFECB3",
              //   "#B3E5FC",
              // ];
              const lightColors = bgColor;
              const randomColor =
                lightColors[Math.floor(Math.random() * lightColors.length)];

              return (
                <div
                  key={product.id}
                  className="col-lg-3 col-sm-6 col-6 px-product-item product-item my-3">
                  <div className="w-100 product-sec">
                    <div className="product">
                      <Link
                        href={`/product/${product.slug}-${product.id}`}
                        className="w-100" prefetch={false}
                      >
                        <Image
                          width={575}
                          height={862}
                          src={product.product_image.medium}
                          alt={product.product_name}
                          loading="lazy"
                          style={{
                            backgroundColor: randomColor,
                          }}
                        />
                      </Link>
                      <div className="rating-box">
                          <span className="rating">4.5</span>
                          <i className="bi bi-star-fill star-icon"></i>
                          <span className="divider">|</span>
                          <span className="count">20</span>
                      </div>
                      <ProductQuickView product={product} />
                    </div>

                    <Link
                      href={`/product/${product.slug}-${product.id}`}
                      className="w-100" prefetch={false}
                    >
                      <div className="product-name-dtl">
                        <div className="title p-3 pb-1">
                          {truncate(product.product_name, 25)}
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

          {loading && (
            <div className="text-center py-4">
              <div className="flex justify-center items-center h-screen">
                <Image src="/img/spinner.gif" alt="Loading..." width={80} height={80} />
              </div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-4 text-muted">
              <p>No more products available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
