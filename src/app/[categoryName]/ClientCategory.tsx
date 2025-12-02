"use client";
import { useState, useEffect, Key } from "react";
import Link from "next/link";
import Image from "next/image";
// import FilterSidebar from "../components/filter/FilterSidebar";
import ProductQuickView from "../product/ProductQuickView";

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
          <div className="d-flex flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp mb-5">
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
          </div>

          {/* Product Grid */}
          <div className="row">
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
                  className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item my-3 col-6">
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
                      <ProductQuickView product={product} />
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
