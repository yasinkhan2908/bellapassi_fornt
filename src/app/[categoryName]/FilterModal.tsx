"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ReactNode, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  CateDatas: any[];
  bgColor?: any[];
  selectedFilters?: any[];
}

export default function FilterModal({ isOpen, onClose, CateDatas }: FilterModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<any>(CateDatas[0] || null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  // Store filters as Map<filterKey, Set<values>>
  const [activeFilters, setActiveFilters] = useState<Map<string, Set<string>>>(new Map());

  // Initialize active filters from URL on component mount
  useEffect(() => {
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      const filtersMap = new Map<string, Set<string>>();
      
      params.forEach((value, key) => {
        if (key.startsWith('')) {
          // Split comma-separated values
          const values = value.split(',').filter(v => v.trim() !== '');
          if (values.length > 0) {
            filtersMap.set(key, new Set(values));
          }
        }
      });
      
      setActiveFilters(filtersMap);
    }
  }, [searchParams]);

  if (!isOpen) return null;

  const handleCategoryClick = (category: any) => {
    console.log("category : ", category.single_data.field_option);
    setSelectedCategory(category);
    setSelectedSubCategory(category.single_data.field_option);
  };

  const handleSubCategoryClick = (subcat: any, categoryName: string) => {
    const filterKey = `${categoryName.toLowerCase().replace(/\s+/g, '_')}`;
    const filterValue = subcat.value || subcat.id || subcat.name;
    
    const newActiveFilters = new Map(activeFilters);
    const existingValues = newActiveFilters.get(filterKey) || new Set<string>();
    const newValues = new Set(existingValues);
    
    // Toggle filter value - add if not present, remove if already present
    if (newValues.has(filterValue)) {
      newValues.delete(filterValue);
    } else {
      newValues.add(filterValue);
    }
    
    // Update or remove the filter key
    if (newValues.size > 0) {
      newActiveFilters.set(filterKey, newValues);
    } else {
      newActiveFilters.delete(filterKey);
    }
    
    setActiveFilters(newActiveFilters);
    updateURLWithFilters(newActiveFilters);
  };

  const updateURLWithFilters = (filters: Map<string, Set<string>>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('')) {
        params.delete(key);
      }
    });
    
    // Add current active filters with comma-separated values
    filters.forEach((values, key) => {
      if (values.size > 0) {
        // Convert Set to comma-separated string
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Update URL
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearAllFilters = () => {
    setActiveFilters(new Map());
    setSelectedCategory(CateDatas[0] || null);
    setSelectedSubCategory(null);
    
    // Clear filter params from URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('')) {
        params.delete(key);
      }
    });
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const isFilterActive = (categoryName: string, subcatValue: string) => {
    const filterKey = `${categoryName.toLowerCase().replace(/\s+/g, '_')}`;
    const filterValues = activeFilters.get(filterKey);
    return filterValues ? filterValues.has(subcatValue) : false;
  };

  const removeFilterValue = (filterKey: string, value: string) => {
    const newActiveFilters = new Map(activeFilters);
    const values = newActiveFilters.get(filterKey);
    
    if (values) {
      const newValues = new Set(values);
      newValues.delete(value);
      
      if (newValues.size > 0) {
        newActiveFilters.set(filterKey, newValues);
      } else {
        newActiveFilters.delete(filterKey);
      }
      
      setActiveFilters(newActiveFilters);
      updateURLWithFilters(newActiveFilters);
    }
  };

  const removeAllFilterValues = (filterKey: string) => {
    const newActiveFilters = new Map(activeFilters);
    newActiveFilters.delete(filterKey);
    setActiveFilters(newActiveFilters);
    updateURLWithFilters(newActiveFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    activeFilters.forEach(values => {
      count += values.size;
    });
    return count;
  };

  const applyFilters = () => {
    console.log('Applied filters:', {
      category: selectedCategory?.single_data?.name,
      activeFilters: Object.fromEntries(Array.from(activeFilters.entries()).map(([key, values]) => [key, Array.from(values)]))
    });
    onClose();
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-container">
        <div className="filter-modal-header">
          <h3 className="filter-modal-title">Filters</h3>
          <span 
            className="text-primary cursor-pointer"
            onClick={clearAllFilters}
          >
            CLEAR ALL
          </span>
        </div>
        
        <div className="filter-modal-content p-0">
          <div className="container-fluid p-0" style={{ height: "100%" }}>
            <div className="row g-0">

                {/* LEFT SIDEBAR */}
                <div className="col-5 border-end bg-light" style={{ height: "100vh", overflowY: "auto" }}>
                    <ul className="list-group list-group-flush">
                        {CateDatas.map((cat, index) => {
                            const isSelected = cat.id === selectedCategory?.id;
                            return (
                                <li 
                                  key={cat.id} 
                                  className={`list-group-item filter-popup-li ${isSelected ? 'active bg-primary text-white' : ''}`}
                                  onClick={() => handleCategoryClick(cat)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {cat.single_data?.name || 'Unnamed Category'}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* RIGHT SIDEBAR CONTENT */}
                <div className="col-7 p-4" style={{ height: "100vh", overflowY: "auto" }}>
                    {selectedCategory ? (
                      <>
                        {/* Selected Category Title */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-check2 text-muted"></i>
                            <span className="fw-bold">{selectedCategory.single_data?.name || 'Not selected'}</span>
                          </div>
                          {getActiveFiltersCount() > 0 && (
                            <span className="badge bg-primary rounded-pill">
                              {getActiveFiltersCount()} active
                            </span>
                          )}
                        </div>
                        
                        {/* Show selected subcategory information */}
                        {selectedSubCategory && Array.isArray(selectedSubCategory) ? (
                          <div className="mt-4 p-0">
                            <ul className="list-group list-group-flush">
                              {selectedSubCategory.map((subcat: any, index: number) => {
                                const subcatValue = subcat.value || subcat.id || `option_${index}`;
                                const isActive = isFilterActive(selectedCategory.single_data?.name, subcatValue);
                                
                                return (
                                  <li 
                                    key={index} 
                                    className={`list-group-item d-flex align-items-center justify-content-between ${isActive ? 'active bg-light border-primary' : ''}`}
                                    onClick={() => handleSubCategoryClick(subcat, selectedCategory.single_data?.name)}
                                    style={{ 
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <i className={`bi ${isActive ? 'bi-check-square-fill text-primary' : 'bi-square text-muted'} me-2`}></i>
                                      <span className={isActive ? 'fw-bold text-primary' : ''}>
                                        {subcat.value || `Option ${index + 1}`}
                                      </span>
                                    </div>
                                    {isActive && (
                                      <span className="badge bg-primary rounded-pill px-2 py-1">
                                        ✓
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : selectedSubCategory ? (
                          <div className="alert alert-info mt-4">
                            Field options are not in array format
                          </div>
                        ) : (
                          <div className="alert alert-warning mt-4">
                            No field options available for this filter
                          </div>
                        )}

                        {/* Active Filters Summary */}
                        {getActiveFiltersCount() > 0 && (
                          <div className="mt-4 border-top pt-3">
                            <h6 className="mb-2">Active Filters:</h6>
                            <div className="d-flex flex-column gap-2">
                              {Array.from(activeFilters.entries()).map(([filterKey, values], index) => {
                                const displayKey = filterKey.replace('', '').replace(/_/g, ' ');
                                const valuesArray = Array.from(values);
                                
                                return (
                                  <div key={index} className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <span className="fw-semibold text-capitalize">{displayKey}:</span>
                                      <button 
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeAllFilterValues(filterKey)}
                                      >
                                        Clear All
                                      </button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                      {valuesArray.map((value, valueIndex) => (
                                        <span 
                                          key={valueIndex}
                                          className="badge bg-primary bg-opacity-10 rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                                        >
                                          {value}
                                          <button 
                                            type="button"
                                            className="btn-close btn-close-sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeFilterValue(filterKey, value);
                                            }}
                                            aria-label="Remove"
                                          ></button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <p className="text-muted">Select a filter from the left</p>
                      </div>
                    )}
                </div>
            </div>

            <div className="d-flex mobile-filter border-top">
              <div className="product-section col-6 mt-1 filter-sorting">
                <div 
                  className="w-100 cursor-pointer p-3 text-center border-end"
                  onClick={onClose}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-secondary">Close</span>
                </div>
              </div>
              <div className="product-section col-6 mt-1">
                {/* <div 
                  className="w-100 cursor-pointer p-3 text-center bg-primary text-white"
                  style={{ cursor: 'pointer' }}
                  onClick={applyFilters}
                >
                  <span className="fw-bold">APPLY FILTERS</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="badge bg-white text-primary rounded-pill ms-2">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div> */}
                 <div 
                  className="w-100 text-primary cursor-pointer p-3 text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={applyFilters}
                >
                  <span className='text-primary fw-bold'>APPLY</span>
                   {getActiveFiltersCount() > 0 && (
                    <span className="badge bg-white text-primary rounded-pill ms-2">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}