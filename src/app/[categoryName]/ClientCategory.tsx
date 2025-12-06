"use client";
import { useState, useEffect, Key, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductQuickView from "../product/ProductQuickView";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSort, faXmark } from '@fortawesome/free-solid-svg-icons'
import FilterModal from "./FilterModal";
import SortingModal from "./SortingModal"; // You'll need to create this

const truncate = (text: string, max: number) => 
  text.length > max ? text.slice(0, max) + "..." : text;
export default function ClientCategory({
  categoryName,
  products,
  CateDatas,
  initialPage,
  lastPage,
  bgColor,
}: {
  categoryName: string;
  products: any[];
  CateDatas: any[];
  bgColor: any[];
  initialPage: number;
  lastPage: number;
}) {
  const CatName = categoryName.replace(/-/g, " ");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false); // Add this
  const [showSortingModal, setShowSortingModal] = useState(false); // Add this

  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < lastPage);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  const [selectedSort, setSelectedSort] = useState("popularity");
  //console.log("bgColor",bgColor);

  // Add sort handler
  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    // Here you would typically fetch sorted products
    console.log("Sorting by:", sort);
  };

  // Add close modal handlers
  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleCloseSortingModal = () => {
    setShowSortingModal(false);
  };

  // 👇 Load more products when user scrolls near bottom
  useEffect(() => {
    const handleScroll = async () => {
      
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (nearBottom && !loading && hasMore) {
        setLoading(true);
        const nextPage = page + 1;
        try {
          //console.log("nextPage",nextPage);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/category-products/${categoryName}?page=${nextPage}`, {
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
  console.log("page CateDatas",CateDatas);
  return (
    <div className="index-page">
      <main className="main">
        <div className="page-title light-background mb-3">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">{CatName}</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/">Home</a></li>
                <li className="current">{CatName}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container">
          <div className="row gx-sm-3 gx-0">
            <div className="col-lg-3 sidebar product-filter-sidebar">

              <div className="widgets-container">

                
                  <div className="brand-filter-widget widget-item">
                    {CateDatas.map((cat, index) => {
                      const isLast = index === CateDatas.length - 1;

                      return (
                        <div key={cat.id} className={isLast ? "" : "pb-5"}>
                          <span className="widget-title">{cat.single_data.name}</span>

                          <div className="brand-filter-content">
                            <div className="brand-list">
                              {cat.single_data.field_option.map((options: {
                                [x: string]: ReactNode; id: Key | null | undefined;
                              }) => (
                                <div className="brand-item" key={options.id}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`brand-${options.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`brand-${options.id}`}>
                                      {options.value}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  </div>  
               
                <div className="pricing-range-widget widget-item">

                  <h3 className="widget-title">Price Range</h3>

                  <div className="price-range-container">
                    <div className="current-range mb-3">
                      <span className="min-price">₹ 0</span>
                      <span className="max-price float-end">₹ 500</span>
                    </div>

                    <div className="range-slider">
                      <div className="slider-track"></div>
                      <div className="slider-progress" ></div>
                      <input type="range" className="min-range" min="0" max="1000" step="10"/>
                      <input type="range" className="max-range" min="0" max="1000" step="10"/>
                    </div>

                  </div>

                </div>
                
              </div>

            </div>
            <div className="col-lg-9">
              <div className="row">
                <div id="category-header" className="category-header section">

                  <div className="container aos-init aos-animate" data-aos="fade-up">

                    <div className="filter-container mb-4 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                      <div className="row mt-0">
                        <div className="col-12 aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                          <div className="active-filters">
                            <span className="active-filter-label">Active Filters:</span>
                            <div className="filter-tags">
                              <span className="filter-tag">
                                Electronics <button className="filter-remove"><i className="bi bi-x"></i></button>
                              </span>
                              <span className="filter-tag">
                                ₹ 50 to ₹ 100 <button className="filter-remove"><i className="bi bi-x"></i></button>
                              </span>
                              <button className="clear-all-btn">Clear All</button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
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
          </div>

          
        </div>
      </main>
      {/* Add the modals at the end of your JSX */}
      <FilterModal 
        isOpen={showFilterModal}
        onClose={handleCloseFilterModal}
        CateDatas={CateDatas}
        bgColor={bgColor}
      />

      <SortingModal 
        isOpen={showSortingModal}
        onClose={handleCloseSortingModal}
        selectedSort={selectedSort}
        onSelectSort={handleSortSelect}
      />

      {/* Update mobile filter buttons */}
      <div className="d-flex mobile-filter">
        <div className="product-section col-6 mt-1 filter-sorting">
          <div 
            className="w-100"
            onClick={() => setShowSortingModal(true)}
          >
            <span><FontAwesomeIcon icon={faSort} className="mr-2" /> Sorting</span>
          </div>
        </div>
        <div className="product-section col-6 mt-1">
          <span 
            className="w-100"
            onClick={() => setShowFilterModal(true)}
          >
            <span><FontAwesomeIcon icon={faFilter} className="mr-2" /> Filter</span>
          </span>
        </div>
      </div>
    </div>
  );
}
