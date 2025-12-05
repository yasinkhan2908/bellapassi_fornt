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
  query: string;
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

  // Fix 1: Remove the empty useEffect that was causing infinite loops
  // Removed: useEffect(() => { fetchProducts(); });

  // Fix 2: Optimized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const nearBottom =
        window.innerHeight + window.scrollY >= 
        document.documentElement.scrollHeight - 200; // Changed from document.body.offsetHeight

      if (nearBottom && !loadingRef.current && hasMore) {
        loadMoreProducts();
      }
    }, DEBOUNCE_DELAY);
  }, [query, page, hasMore]); // Added dependencies

  // Fix 3: Separate loadMoreProducts function
  const loadMoreProducts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/search-products/${query}?page=${nextPage}`,
        { cache: 'no-store' }
      );
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const json = await res.json();
      const newProducts = json.data?.products?.data || [];
      
      if (newProducts.length > 0) {
        setAllProducts((prev) => [...prev, ...newProducts]);
        setPage(json.data.products.current_page);
        setHasMore(json.data.products.current_page < json.data.products.last_page);
      }
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [query, page, hasMore]);

  // Fix 4: Proper scroll event listener setup
  useEffect(() => {
    // Initialize with initial props
    setAllProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialPage < lastPage);
    loadingRef.current = false;
  }, [initialProducts, initialPage, lastPage, query]); // Reset when query changes

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleScroll]);

  const getRandomColor = () => {
    const colors = bgColor.length > 0 ? bgColor : ['#f9c0c847', '#e2faf9'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background mb-3">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Search Results for "{query}"</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Search</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          {/* Product Grid */}
          {allProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted">No products found for "{query}"</p>
            </div>
          ) : (
            <>
              <div className="row gx-sm-3 gx-0">
                {allProducts.map((product) => {
                  const randomColor = getRandomColor();
                  
                  return (
                    <div
                      key={`${product.id}-${product.slug}`}
                      className="col-lg-3 col-sm-6 col-6 px-product-item product-item my-3"
                    >
                      <div className="w-100 product-sec">
                        <div className="product">
                          <Link
                            href={`/product/${product.slug}-${product.id}`}
                            className="w-100"
                            prefetch={false}
                          >
                            <Image
                              width={575}
                              height={862}
                              src={product.product_image.medium}
                              alt={product.product_name}
                              loading="lazy"
                              style={{ backgroundColor: randomColor }}
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
                          className="w-100"
                          prefetch={false}
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

              {isLoadingMore && (
                <div className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <Image src="/img/spinner.gif" alt="Loading..." width={80} height={80} />
                  </div>
                </div>
              )}

              {!hasMore && allProducts.length > 0 && (
                <div className="text-center py-4 text-muted">
                  <p>No more products available</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}