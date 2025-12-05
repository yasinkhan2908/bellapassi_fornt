"use client";
import { useState, useEffect, Key } from "react";
import Link from "next/link";
import Image from "next/image";
// import FilterSidebar from "../components/filter/FilterSidebar";
import ProductQuickView from "../product/ProductQuickView";

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

  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < lastPage);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState(products);
  //console.log("bgColor",bgColor);
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
  //console.log("page CateDatas",CateDatas);
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
          {/* Filters + Sort */}
          {/* <div className="d-flex flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp mb-5">
            <Link
              href="#"
              className="filter-btn"
              data-bs-toggle="offcanvas"
              data-bs-target="#filtersidebar" prefetch={false}
            >
              <i className="bi bi-list"></i> Filter
            </Link>
            <select className="sort-by-btn tf-btn btn-line">
              <option value="">Sort By</option>
              <option value="a-z">Alphabetically, A-Z</option>
              <option value="z-a">Alphabetically, Z-A</option>
              <option value="price-low-high">Price, low to high</option>
              <option value="price-high-low">Price, high to low</option>
            </select>
          </div>
          <div className="offcanvas offcanvas-start leftsidebar filtersidebar" id="filtersidebar" aria-labelledby="sidebarLabel">
            <div className="filtter-apply text-center">
              <button className="">Apply</button>
            </div>
            <div className="filter-option p-2">
              <div className="accordion" id="accordionExample">
                {CateDatas.map((cat) => (
                  <div className="accordion-item" key={cat.id}>
                    <h2 className="accordion-header bg-gray-100" id={`heading${cat.id}`}>
                      <span
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${cat.id}`}
                        aria-controls={`collapse${cat.id}`}
                      >
                        {cat.single_data.name}
                      </span>
                    </h2>
                    <div
                      id={`collapse${cat.id}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${cat.id}`}
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="filter-body">
                          <ul>
                            {cat.single_data.field_option.map((options: { id: Key | null | undefined; }) => (
                              <li key={options.id}>{options.id}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}


                <div className="accordion-item">
                    <h2 className="accordion-header bg-gray-100" id="headingSideTwo">
                        <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-controls="collapseTwo">
                            Color
                        </span>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingSideTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="filter-body">
                              <ul>
                                <li>White</li>
                                <li>Black</li>
                                <li>Blue</li>
                                <li>Red</li>
                                <li>Yellow</li>
                                <li>Green</li>
                              </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header bg-gray-100" id="headingSideThree">
                        <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-controls="collapseThree">
                            Toe Shape
                        </span>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingSideThree" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <div className="filter-body">
                              <ul>
                                <li>Rounde Toe</li>
                                <li>Narrow square</li>
                              </ul>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Product Grid */}
          <div className="row gx-sm-3 gx-0">
            <div className="col-lg-3 sidebar">

              <div className="widgets-container">

                
                <div className="brand-filter-widget widget-item">

                  <h3 className="widget-title">Filter by Brand</h3>

                  <div className="brand-filter-content">
                    

                    <div className="brand-list">
                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand1"/>
                          <label className="form-check-label" htmlFor="brand1">
                            Nike
                            <span className="brand-count">(24)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand2"/>
                          <label className="form-check-label" htmlFor="brand2">
                            Adidas
                            <span className="brand-count">(18)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand3"/>
                          <label className="form-check-label" htmlFor="brand3">
                            Puma
                            <span className="brand-count">(12)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand4"/>
                          <label className="form-check-label" htmlFor="brand4">
                            Reebok
                            <span className="brand-count">(9)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand5"/>
                          <label className="form-check-label" htmlFor="brand5">
                            Under Armour
                            <span className="brand-count">(7)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand6"/>
                          <label className="form-check-label" htmlFor="brand6">
                            New Balance
                            <span className="brand-count">(6)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand7"/>
                          <label className="form-check-label" htmlFor="brand7">
                            Converse
                            <span className="brand-count">(5)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand8"/>
                          <label className="form-check-label" htmlFor="brand8">
                            Vans
                            <span className="brand-count">(4)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="brand-actions">
                      <button className="btn btn-sm btn-outline-primary">Apply Filter</button>
                      <button className="btn btn-sm btn-link">Clear All</button>
                    </div>
                  </div>

                </div>  
                
                <div className="pricing-range-widget widget-item">

                  <h3 className="widget-title">Price Range</h3>

                  <div className="price-range-container">
                    <div className="current-range mb-3">
                      <span className="min-price">$0</span>
                      <span className="max-price float-end">$500</span>
                    </div>

                    <div className="range-slider">
                      <div className="slider-track"></div>
                      <div className="slider-progress" ></div>
                      <input type="range" className="min-range" min="0" max="1000" step="10"/>
                      <input type="range" className="max-range" min="0" max="1000" step="10"/>
                    </div>

                    <div className="price-inputs mt-3">
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control min-price-input" placeholder="Min" min="0" max="1000" step="10" />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-text">$</span>
                            <input type="number" className="form-control max-price-input" placeholder="Max" min="0" max="1000" step="10" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="filter-actions mt-3">
                      <button type="button" className="btn btn-sm btn-primary w-100" >Apply Filter</button>
                    </div>
                  </div>

                </div>
                
                
                <div className="brand-filter-widget widget-item">

                  <h3 className="widget-title">Filter by Brand</h3>

                  <div className="brand-filter-content">
                    

                    <div className="brand-list">
                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand1"/>
                          <label className="form-check-label" htmlFor="brand1">
                            Nike
                            <span className="brand-count">(24)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand2"/>
                          <label className="form-check-label" htmlFor="brand2">
                            Adidas
                            <span className="brand-count">(18)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand3"/>
                          <label className="form-check-label" htmlFor="brand3">
                            Puma
                            <span className="brand-count">(12)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand4"/>
                          <label className="form-check-label" htmlFor="brand4">
                            Reebok
                            <span className="brand-count">(9)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand5"/>
                          <label className="form-check-label" htmlFor="brand5">
                            Under Armour
                            <span className="brand-count">(7)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand6"/>
                          <label className="form-check-label" htmlFor="brand6">
                            New Balance
                            <span className="brand-count">(6)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand7"/>
                          <label className="form-check-label" htmlFor="brand7">
                            Converse
                            <span className="brand-count">(5)</span>
                          </label>
                        </div>
                      </div>

                      <div className="brand-item">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="brand8"/>
                          <label className="form-check-label" htmlFor="brand8">
                            Vans
                            <span className="brand-count">(4)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="brand-actions">
                      <button className="btn btn-sm btn-outline-primary">Apply Filter</button>
                      <button className="btn btn-sm btn-link">Clear All</button>
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
                      {/* <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="filter-item search-form">
                            <label htmlFor="productSearch" className="form-label">Search Products</label>
                            <div className="input-group">
                              <input type="text" className="form-control" id="productSearch" placeholder="Search for products..." aria-label="Search for products" />
                              <button className="btn search-btn" type="button">
                                <i className="bi bi-search"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2">
                          <div className="filter-item">
                            <label htmlFor="priceRange" className="form-label">Price Range</label>
                            <select className="form-select" id="priceRange" >
                              <option selected>All Prices</option>
                              <option>Under $25</option>
                              <option>$25 to $50</option>
                              <option>$50 to $100</option>
                              <option>$100 to $200</option>
                              <option>$200 &amp; Above</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2">
                          <div className="filter-item">
                            <label htmlFor="sortBy" className="form-label">Sort By</label>
                            <select className="form-select" id="sortBy">
                              <option selected>Featured</option>
                              <option>Price: Low to High</option>
                              <option>Price: High to Low</option>
                              <option>Customer Rating</option>
                              <option>Newest Arrivals</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="filter-item">
                            <label className="form-label">View</label>
                            <div className="d-flex align-items-center">
                              <div className="view-options me-3">
                                <button type="button" className="btn view-btn active" data-view="grid" aria-label="Grid view">
                                  <i className="bi bi-grid-3x3-gap-fill"></i>
                                </button>
                                <button type="button" className="btn view-btn" data-view="list" aria-label="List view">
                                  <i className="bi bi-list-ul"></i>
                                </button>
                              </div>
                              <div className="items-per-page">
                                <select className="form-select" id="itemsPerPage" aria-label="Items per page">
                                  <option value="12">12 per page</option>
                                  <option value="24">24 per page</option>
                                  <option value="48">48 per page</option>
                                  <option value="96">96 per page</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}

                      <div className="row mt-3">
                        <div className="col-12 aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                          <div className="active-filters">
                            <span className="active-filter-label">Active Filters:</span>
                            <div className="filter-tags">
                              <span className="filter-tag">
                                Electronics <button className="filter-remove"><i className="bi bi-x"></i></button>
                              </span>
                              <span className="filter-tag">
                                $50 to $100 <button className="filter-remove"><i className="bi bi-x"></i></button>
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
                
              </div>
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
