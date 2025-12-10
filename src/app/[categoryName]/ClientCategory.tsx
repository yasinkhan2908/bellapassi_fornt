"use client";
import { useState, useEffect, ChangeEvent, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductQuickView from "../product/ProductQuickView";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons'
import FilterModal from "./FilterModal";
import SortingModal from "./SortingModal";
import PriceRangeWidget from "./PriceRangeWidget";
import { useRouter, useSearchParams } from "next/navigation";

const truncate = (text: string, max: number) => 
  text.length > max ? text.slice(0, max) + "..." : text;

interface FieldOption {
  [x: string]: any;
  id: string | number;
  value: string;
}

interface Product {
  id: number;
  slug: string;
  product_name: string;
  price: number;
  mrp: number;
  product_image: {
    medium: string;
  };
  name?: string;
  discount_price?: number;
  image?: string;
  description?: string;
}

interface FilterGroup {
  id: number;
  single_data: {
    name: string;
    field_option: FieldOption[];
  };
}

interface SizeGroup {
  [x: string]: any;
  id: number;
  size: string;
}

interface PriceRange {
  min?: number;
  max?: number;
}

export default function ClientCategory({
  categoryName,
  products,
  CateSizes,
  CateDatas,
  initialPage,
  lastPage,
  bgColor,
}: {
  categoryName: string;
  products: Product[];
  CateDatas: FilterGroup[];
  CateSizes:SizeGroup,
  bgColor: string[];
  initialPage: number;
  lastPage: number;
}) {
  const CatName = categoryName.replace(/-/g, " ");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortingModal, setShowSortingModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < lastPage);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [selectedSort, setSelectedSort] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  //
  //console.log("CateDatas : ",CateDatas);
  // Create a single price range variable from URL
  const getPriceRangeFromUrl = (): PriceRange => {
    const minpriceStr = searchParams.get('minprice');
    const maxpriceStr = searchParams.get('maxprice');
    
    const priceRange: PriceRange = {};
    
    if (minpriceStr) {
      const min = parseInt(minpriceStr);
      if (!isNaN(min)) {
        priceRange.min = min;
      }
    }
    
    if (maxpriceStr) {
      const max = parseInt(maxpriceStr);
      if (!isNaN(max)) {
        priceRange.max = max;
      }
    }
    
    return priceRange;
  };
  
  // Get price range as a single variable
  const priceRange = getPriceRangeFromUrl();
  
  // Check if price filter is active
  const hasPriceFilter = priceRange.min !== undefined || priceRange.max !== undefined;
  
  // Format price range for display
  const getPriceRangeString = (): string => {
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      return `₹ ${priceRange.min} - ₹${priceRange.max}`;
    } else if (priceRange.min !== undefined) {
      return `Above ₹ ${priceRange.min}`;
    } else if (priceRange.max !== undefined) {
      return `Below ₹ ${priceRange.max}`;
    }
    return '';
  };

  // Function to fetch products including price filter
  const fetchProducts = useCallback(async (
    pageNum: number = 1,
    filters: Record<string, string[]> = {},
    shouldReplace: boolean = false
  ) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      console.log("Page No. = ", pageNum.toString());
      
      // Add regular filters
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.set(key, values.join(","));
        }
      });
      
      // Add price filters from URL
      if (priceRange.min !== undefined) {
        params.set('minprice', priceRange.min.toString());
      }
      if (priceRange.max !== undefined) {
        params.set('maxprice', priceRange.max.toString());
      }
      
      // if (selectedSort !== "popularity") {
        //params.set('sort', selectedSort);
      // }
      
      console.log("Fetch params:", params.toString());
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/category-products/${categoryName}?${params.toString()}`;
      
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      
      const productData = Array.isArray(json) ? json : json.data?.products || json;
      
      if (shouldReplace) {
        setAllProducts(productData.data || productData);
      } else {
        setAllProducts(prev => [...prev, ...(productData.data || productData)]);
      }
      
      setPage(productData.current_page || 1);
      setHasMore((productData.current_page || 1) < (productData.last_page || 1));
      
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
      setIsInitialLoad(false); // This sets isInitialLoad to false
    }
  }, [categoryName, selectedSort, priceRange.min, priceRange.max]);

  // Function to update filters and fetch products
  const updateFiltersAndFetch = useCallback((newFilters: Record<string, string[]>) => {
    setIsUpdatingFilters(true);
    
    const params = new URLSearchParams();
    
    // Add regular filters
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
    });
    
    // Add price filters if they exist in URL
    if (priceRange.min !== undefined) {
      params.set('minprice', priceRange.min.toString());
    }
    if (priceRange.max !== undefined) {
      params.set('maxprice', priceRange.max.toString());
    }
    
    // if (selectedSort !== "popularity") {
    //   params.set('sort', selectedSort);
    // }
    
    const queryString = params.toString();
    const newUrl = `?${queryString}`;
    
    router.push(newUrl, { scroll: false });
    
    setPage(1);
    setHasMore(true);
    
    // Fetch products with new filters
    fetchProducts(1, newFilters, true);
    
    // Reset updating flag after a delay
    setTimeout(() => {
      setIsUpdatingFilters(false);
    }, 100);
  }, [router, selectedSort, fetchProducts, priceRange]);

  // Function to clear price filter
  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minprice');
    params.delete('maxprice');
    //params.delete('sort');
    
    // Preserve other filters
    const newFilters = { ...selected };
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] && newFilters[key].length > 0) {
        params.set(key, newFilters[key].join(","));
      }
    });
    
    // if (selectedSort !== "popularity") {
    //   params.set('sort', selectedSort);
    // }
    
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Trigger refetch without price filter
    setIsUpdatingFilters(true);
    setPage(1);
    fetchProducts(1, selected, true);
    
    setTimeout(() => {
      setIsUpdatingFilters(false);
    }, 100);
  };

  // Initialize from URL parameters
  useEffect(() => {
    const initialFilters: Record<string, string[]> = {};
    let hasFiltersFromUrl = false;
    
    // Parse URL parameters (excluding price filters)
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'sort' && key !== 'minprice' && key !== 'maxprice') {
        initialFilters[key] = value.split(",");
        hasFiltersFromUrl = true;
      }
    });
    
    // Set selected filters from URL
    setSelected(initialFilters);
    
    // Set sorting from URL if present
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSelectedSort(sortParam);
    }
    
    // Always mark initial load as complete after URL parsing
    // This ensures the scroll handler will work
    setIsInitialLoad(false);
    
    // Only fetch if we have filters from URL
    if (hasFiltersFromUrl) {
      fetchProducts(1, initialFilters, true);
    }
    
    // Fetch with price filter if it exists in URL
    if (priceRange.min !== undefined || priceRange.max !== undefined) {
      fetchProducts(1, initialFilters, true);
    }
  }, [searchParams]); // Remove isInitialLoad from dependencies

  // Handle filter changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isUpdatingFilters) return;
    
    const value = e.target.value;
    const group = e.target.dataset.filter;
    const checked = e.target.checked;

    if (!group) return;

    setSelected((prev) => {
      const prevValues = prev[group] || [];
      const newValues = checked
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value);

      const updated = { ...prev, [group]: newValues };
      
      // Update filters and fetch new products
      updateFiltersAndFetch(updated);
      
      return updated;
    });
  };

  // Handle sort selection
  const handleSortSelect = (sort: string) => {
    console.log("remove sort : ",sort);
    setSelectedSort(sort);
    setShowSortingModal(false);
    
    updateFiltersAndFetch(selected);
  };

  // Handle infinite scroll - FIXED VERSION
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = async () => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // Throttle the scroll handler
      timeoutId = setTimeout(() => {
        // Calculate scroll position more accurately
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if we're near the bottom (within 200px)
        const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;
        
        // console.log("Scroll check:", {
        //   scrollTop,
        //   windowHeight,
        //   documentHeight,
        //   isNearBottom,
        //   loading,
        //   hasMore,
        //   isUpdatingFilters,
        //   isInitialLoad,
        //   page
        // });
        
        if (isNearBottom && !loading && hasMore && !isUpdatingFilters && !isInitialLoad) {
          const nextPage = page + 1;
          console.log("Loading more products, page:", nextPage);
          fetchProducts(nextPage, selected, false);
        }
      }, 100); // 100ms throttle
    };

    window.addEventListener("scroll", handleScroll);
    
    // Also check on initial load in case the page is already at the bottom
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page, hasMore, loading, selected, fetchProducts, isInitialLoad, isUpdatingFilters]);

  // Remove a filter item
  const removeItem = (group: string, value: string) => {
    if (isUpdatingFilters) return;
    console.log("group : ",group);
    console.log("value : ",value);
    if(group == 'sort')
    {
      setSelectedSort("");
    }
    setSelected(prev => {
      const newFilters = {
        ...prev,
        [group]: prev[group]?.filter(item => item !== value) || []
      };
      
      if (newFilters[group].length === 0) {
        delete newFilters[group];
      }
      
      updateFiltersAndFetch(newFilters);
      return newFilters;
    });
  };

  // Clear all filters including price
  const clearAll = () => {
    if (isUpdatingFilters) return;
    
    setSelected({});
    setSelectedSort("");
    
    // Clear URL completely
    router.push("?", { scroll: false });
    
    // Fetch without any filters
    fetchProducts(1, {}, true);
  };

  // Handle price change from PriceRangeWidget
  const handlePriceChange = (min: number, max: number) => {
    // This will be triggered by the PriceRangeWidget component
    // The URL will be updated automatically by PriceRangeWidget
    setIsUpdatingFilters(true);
    
    // Delay fetch to allow URL update
    setTimeout(() => {
      fetchProducts(1, selected, true);
      setIsUpdatingFilters(false);
    }, 500);
  };

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setSelected(newFilters);
    updateFiltersAndFetch(newFilters);
    setShowFilterModal(false);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleCloseSortingModal = () => {
    setShowSortingModal(false);
  };

  const transformProductForQuickView = (product: Product) => {
    return {
      ...product,
      name: product.product_name,
      discount_price: product.price,
      price: product.mrp,
      image: product.product_image.medium,
      description: product.product_name,
    };
  };

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
              <div className="pricing-range-widget widget-item">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="widget-title m-0">Select Size</h3>
                </div>
                <div className="brand-filter-content">
                  <div className="brand-list">
                    <div className="brand-item">
                       
                      {CateSizes.map((size: { size: string; id: Key | null | undefined; }) => {
                        const sizeValue = size.size ?? "";
                        
                        return (
                          <div className="brand-item mr-2 mb-2" key={size.id}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="size-selection" // ← ADD THIS SAME NAME TO ALL RADIOS
                                id={`size-${size.id}`}
                                value={sizeValue}
                                data-filter='size'
                                onChange={handleChange}
                                disabled={isUpdatingFilters}
                              />
                              <label className="form-check-label" htmlFor={`size-${size.id}`}>
                                {sizeValue || "Unknown Size"}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="widgets-container">
                <div className="brand-filter-widget widget-item">
                  
                  {CateDatas.map((cat, index) => {
                    const isLast = index === CateDatas.length - 1;
                    const filterGroupName = cat.single_data.name;
                    const selectedValues = selected[filterGroupName] || [];
                    
                    return (
                      <div key={cat.id} className={isLast ? "" : "pb-5"}>
                        <span className="widget-title">{filterGroupName}</span>
                        <div className="brand-filter-content">
                          <div className="brand-list">
                            {cat.single_data.field_option.map((options: FieldOption) => {
                              const isChecked = selectedValues.includes(options.value);
                              
                              return (
                                <div className="brand-item" key={options.id}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`brand-${options.id}`}
                                      value={options.value}
                                      data-filter={filterGroupName}
                                      onChange={handleChange}
                                      checked={isChecked}
                                      disabled={isUpdatingFilters}
                                    />
                                    <label className="form-check-label" htmlFor={`brand-${options.id}`}>
                                      {options.value}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Add PriceRangeWidget with URL sync */}
                <PriceRangeWidget 
                  min={0}
                  max={10000}
                  step={100}
                  onChange={handlePriceChange}
                />
              </div>
            </div>

            <div className="col-lg-9">
              <div className="row">
                {(Object.keys(selected).length > 0 || 
                                selectedSort.length > 0 || 
                                hasPriceFilter) && (
                  <div id="category-header" className="category-header section">
                    <div className="container" data-aos="fade-up">
                      <div className="filter-container mb-4" data-aos="fade-up" data-aos-delay="100">
                        <div className="row mt-0">
                          
                            <div className="col-12" data-aos="fade-up" data-aos-delay="200">
                              <div className="active-filters">
                                <span className="active-filter-label">Active Filters:</span>
                                <div className="filter-tags">
                                  {Object.keys(selected).length === 0 && 
                                  selectedSort === "popularity" && 
                                  !hasPriceFilter ? (
                                    <p className="no-filter-item">No filter selected.</p>
                                  ) : (
                                    <>
                                      {/* Display price filter */}
                                      {hasPriceFilter && (
                                        <span className="filter-tag">
                                          {getPriceRangeString()} 
                                          <button 
                                            className="filter-remove" 
                                            onClick={clearPriceFilter}
                                            disabled={isUpdatingFilters}
                                          >
                                            <i className="bi bi-x"></i>
                                          </button>
                                        </span>
                                      )}
                                      
                                      {/* Display sorting filter */}
                                      {selectedSort.length > 0 && (
                                        <span className="filter-tag">
                                          {selectedSort}
                                          <button 
                                            className="filter-remove" 
                                            onClick={() => removeItem('sort', selectedSort)}
                                            disabled={isUpdatingFilters}
                                          >
                                            <i className="bi bi-x"></i>
                                          </button>
                                        </span>
                                      )}
                                      
                                      {/* Display other filters */}
                                      {Object.entries(selected).flatMap(([group, values]) =>
                                        values.map(value => (
                                          <span key={`${group}-${value}`} className="filter-tag">
                                            {value}
                                            <button 
                                              className="filter-remove" 
                                              onClick={() => removeItem(group, value)}
                                              disabled={isUpdatingFilters}
                                            >
                                              <i className="bi bi-x"></i>
                                            </button>
                                          </span>
                                        ))
                                      )}
                                    </>
                                  )}
                                  {(Object.keys(selected).length > 0 || 
                                    selectedSort.length > 0 || 
                                    hasPriceFilter) && (
                                    <button 
                                      className="clear-all-btn" 
                                      onClick={clearAll}
                                      disabled={isUpdatingFilters}
                                    >
                                      Clear All
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          
                        </div>
                      </div>
                    </div>
                    </div>
                  )}
                

                {/* Product Grid */}
                {allProducts.map((product) => {
                  const randomColor = bgColor[Math.floor(Math.random() * bgColor.length)];
                  const transformedProduct = transformProductForQuickView(product);
                  
                  return (
                    <div key={product.id} className="col-lg-3 col-sm-6 col-6 px-product-item product-item my-3">
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
                          <ProductQuickView product={transformedProduct} />
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

              {loading && (
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
              
              {allProducts.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-lg">No products found with the selected filters.</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={clearAll}
                    disabled={isUpdatingFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Filter and Sorting Modals */}
      <FilterModal 
  isOpen={showFilterModal}
  onClose={handleCloseFilterModal}
  CateDatas={CateDatas}
  CateSizes={CateSizes as unknown as { size: string; id: Key | null | undefined; }[]}
  bgColor={bgColor}
/>

      <SortingModal 
        isOpen={showSortingModal}
        onClose={handleCloseSortingModal}
        selectedSort={selectedSort}
        onSelectSort={handleSortSelect}
      />

      {/* Mobile filter buttons */}
      <div className="d-flex mobile-filter">
        <div className="product-section col-6 mt-1 filter-sorting">
          <div className="w-100" onClick={() => setShowSortingModal(true)}>
            <span><FontAwesomeIcon icon={faSort} className="mr-2" /> Sorting</span>
          </div>
        </div>
        <div className="product-section col-6 mt-1">
          <span className="w-100" onClick={() => setShowFilterModal(true)}>
            <span><FontAwesomeIcon icon={faFilter} className="mr-2" /> Filter</span>
          </span>
        </div>
      </div>
    </div>
  );
}