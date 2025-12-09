"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  CateDatas: any[];
  bgColor?: any[];
  selectedFilters?: any[];
  minPriceRange?: number;
  maxPriceRange?: number;
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  CateDatas, 
  minPriceRange = 0, 
  maxPriceRange = 1000 
}: FilterModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<any>(CateDatas[0] || null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  
  // Store filters as Map<filterKey, Set<values>>
  const [activeFilters, setActiveFilters] = useState<Map<string, Set<string>>>(new Map());
  
  // Price filter state
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: ''
  });
  const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({
    min: minPriceRange,
    max: maxPriceRange
  });
  const [priceError, setPriceError] = useState<string>('');
  const [isPriceDragging, setIsPriceDragging] = useState<'min' | 'max' | null>(null);
  
  // Refs for slider
  const sliderRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  // Initialize active filters and price range from URL on component mount
  useEffect(() => {
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      const filtersMap = new Map<string, Set<string>>();
      let minPrice = '';
      let maxPrice = '';
      
      params.forEach((value, key) => {
        if (key === 'min_price') {
          minPrice = value;
          const minValue = parseFloat(value);
          if (!isNaN(minValue)) {
            setTempPriceRange(prev => ({ ...prev, min: minValue }));
          }
        } else if (key === 'max_price') {
          maxPrice = value;
          const maxValue = parseFloat(value);
          if (!isNaN(maxValue)) {
            setTempPriceRange(prev => ({ ...prev, max: maxValue }));
          }
        } else if (key.startsWith('')) {
          // Split comma-separated values
          const values = value.split(',').filter(v => v.trim() !== '');
          if (values.length > 0) {
            filtersMap.set(key, new Set(values));
          }
        }
      });
      
      setActiveFilters(filtersMap);
      setPriceRange({ min: minPrice, max: maxPrice });
    }
  }, [searchParams, minPriceRange, maxPriceRange]);

  // Add price as a category option
  const categoriesWithPrice = [
    ...CateDatas,
    {
      id: 'price-filter',
      single_data: {
        name: 'Price',
        field_option: 'price_range'
      }
    }
  ];

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPriceDragging || !sliderRef.current) return;
    
    e.preventDefault();
    
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    let value = Math.round(minPriceRange + percentage * (maxPriceRange - minPriceRange));
    
    // Round to nearest 5 for better UX
    value = Math.round(value / 5) * 5;
    
    setTempPriceRange(prev => {
      let newMin = prev.min;
      let newMax = prev.max;
      
      if (isPriceDragging === 'min') {
        newMin = Math.min(value, prev.max - 1);
        // Update priceRange state
        setPriceRange(p => ({ ...p, min: newMin.toString() }));
      } else {
        newMax = Math.max(value, prev.min + 1);
        // Update priceRange state
        setPriceRange(p => ({ ...p, max: newMax.toString() }));
      }
      
      return { min: newMin, max: newMax };
    });
  }, [isPriceDragging, minPriceRange, maxPriceRange]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPriceDragging || !sliderRef.current || !e.touches[0]) return;
    
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    let value = Math.round(minPriceRange + percentage * (maxPriceRange - minPriceRange));
    
    // Round to nearest 5 for better UX
    value = Math.round(value / 5) * 5;
    
    setTempPriceRange(prev => {
      let newMin = prev.min;
      let newMax = prev.max;
      
      if (isPriceDragging === 'min') {
        newMin = Math.min(value, prev.max - 1);
        setPriceRange(p => ({ ...p, min: newMin.toString() }));
      } else {
        newMax = Math.max(value, prev.min + 1);
        setPriceRange(p => ({ ...p, max: newMax.toString() }));
      }
      
      return { min: newMin, max: newMax };
    });
  }, [isPriceDragging, minPriceRange, maxPriceRange]);

  const handleMouseUp = useCallback(() => {
    setIsPriceDragging(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Apply the price filter after dragging
    applyPriceFilter();
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback(() => {
    setIsPriceDragging(null);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // Apply the price filter after dragging
    applyPriceFilter();
  }, [handleTouchMove]);

  // Mouse event handlers for slider - FIXED VERSION
  const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPriceDragging(thumb);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch event handlers for mobile - FIXED VERSION
  const handleTouchStart = (thumb: 'min' | 'max') => (e: React.TouchEvent) => {
    // Don't call preventDefault() here to avoid passive event warning
    setIsPriceDragging(thumb);
    
    // Add passive: false to touch event listeners
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  };

  // Calculate slider positions
  const getMinThumbPosition = () => {
    return ((tempPriceRange.min - minPriceRange) / (maxPriceRange - minPriceRange)) * 100;
  };

  const getMaxThumbPosition = () => {
    return ((tempPriceRange.max - minPriceRange) / (maxPriceRange - minPriceRange)) * 100;
  };

  const getTrackFillPosition = () => {
    return {
      left: `${getMinThumbPosition()}%`,
      width: `${getMaxThumbPosition() - getMinThumbPosition()}%`
    };
  };

  const applyPriceFilter = () => {
    if (!validatePriceRange()) return;
    
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters except price
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'min_price' && key !== 'max_price') {
        params.delete(key);
      }
    });
    
    // Add current active filters with comma-separated values
    activeFilters.forEach((values, key) => {
      if (values.size > 0) {
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Update or remove min_price parameter
    if (priceRange.min.trim()) {
      params.set('min_price', priceRange.min);
    } else {
      params.delete('min_price');
    }
    
    // Update or remove max_price parameter
    if (priceRange.max.trim()) {
      params.set('max_price', priceRange.max);
    } else {
      params.delete('max_price');
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    setTempPriceRange({ min: minPriceRange, max: maxPriceRange });
    setPriceError('');
    
    // Update URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters except non-price filters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'min_price' && key !== 'max_price') {
        params.delete(key);
      }
    });
    
    // Add current active filters
    activeFilters.forEach((values, key) => {
      if (values.size > 0) {
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Remove price params
    params.delete('min_price');
    params.delete('max_price');
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const updateURLWithFilters = (filters: Map<string, Set<string>>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters (except price)
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'min_price' && key !== 'max_price') {
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
    setSelectedCategory(categoriesWithPrice[0] || null);
    setSelectedSubCategory(null);
    setPriceRange({ min: '', max: '' });
    setTempPriceRange({ min: minPriceRange, max: maxPriceRange });
    setPriceError('');
    
    // Clear all filter params from URL
    const params = new URLSearchParams();
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const isFilterActive = (categoryName: string, subcatValue: string) => {
    const filterKey = `${categoryName}`;
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
    
    // Add price filters to count if they exist
    if (priceRange.min.trim() || priceRange.max.trim()) {
      count += 1;
    }
    
    return count;
  };

  const applyFilters = () => {
    // Apply all filters including price
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') || key === 'min_price' || key === 'max_price') {
        params.delete(key);
      }
    });
    
    // Add current active filters with comma-separated values
    activeFilters.forEach((values, key) => {
      if (values.size > 0) {
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Add price filters if they exist
    if (priceRange.min.trim()) {
      params.set('min_price', priceRange.min);
    }
    if (priceRange.max.trim()) {
      params.set('max_price', priceRange.max);
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
    
    console.log('Applied filters:', {
      category: selectedCategory?.single_data?.name,
      priceRange: priceRange,
      activeFilters: Object.fromEntries(Array.from(activeFilters.entries()).map(([key, values]) => [key, Array.from(values)]))
    });
    onClose();
  };

  // Check if price filter is currently active
  const isPriceFilterActive = priceRange.min.trim() !== '' || priceRange.max.trim() !== '';

  // Handle quick filter selection
  const handleQuickFilterSelect = (min: string, max: string) => {
    const newPriceRange = {
      min: min,
      max: max
    };
    
    setPriceRange(newPriceRange);
    
    // Update temp range for slider
    const minNum = min ? parseFloat(min) : minPriceRange;
    const maxNum = max ? parseFloat(max) : maxPriceRange;
    
    if (!isNaN(minNum) && !isNaN(maxNum)) {
      setTempPriceRange({
        min: minNum,
        max: maxNum
      });
    }
    
    // Apply filter immediately
    setTimeout(() => {
      if (validatePriceRangeWithValues(min, max)) {
        applyPriceFilter();
      }
    }, 50);
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    // Allow only numbers and decimal points
    const numericValue = value.replace(/[^\d.]/g, '');
    
    const newPriceRange = {
      ...priceRange,
      [type]: numericValue
    };
    
    setPriceRange(newPriceRange);
    
    // Also update temp range for slider if valid number
    const numValue = parseFloat(numericValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(minPriceRange, Math.min(maxPriceRange, numValue));
      setTempPriceRange(prev => ({
        ...prev,
        [type]: clampedValue
      }));
    }
    
    // Clear error when user starts typing
    if (priceError) setPriceError('');
    
    // If the other field has a value, validate the range
    if ((type === 'min' && priceRange.max.trim()) || (type === 'max' && priceRange.min.trim())) {
      validatePriceRangeWithValues(newPriceRange.min, newPriceRange.max);
    }
  };

  const validatePriceRangeWithValues = (min: string, max: string): boolean => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    
    // Both empty is valid (no price filter)
    if (!min && !max) return true;
    
    // Validate numeric values
    if (min && isNaN(minNum)) {
      setPriceError('Minimum price must be a number');
      return false;
    }
    
    if (max && isNaN(maxNum)) {
      setPriceError('Maximum price must be a number');
      return false;
    }
    
    // Validate min <= max if both are provided
    if (min && max && minNum > maxNum) {
      setPriceError('Minimum price cannot be greater than maximum price');
      return false;
    }
    
    // Validate within range
    if ((min && minNum < minPriceRange) || (max && maxNum > maxPriceRange)) {
      setPriceError(`Price must be between $${minPriceRange} and $${maxPriceRange}`);
      return false;
    }
    
    // Validate non-negative prices
    if ((min && minNum < 0) || (max && maxNum < 0)) {
      setPriceError('Price cannot be negative');
      return false;
    }
    
    setPriceError('');
    return true;
  };

  const validatePriceRange = (): boolean => {
    return validatePriceRangeWithValues(priceRange.min, priceRange.max);
  };

  const handleCategoryClick = (category: any) => {
    if (category.id === 'price-filter') {
      setSelectedCategory(category);
      setSelectedSubCategory('price_range');
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(category.single_data.field_option);
    }
  };

  const handleSubCategoryClick = (subcat: any, categoryName: string) => {
    const filterKey = `${categoryName}`;
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

  // Don't put early return before hooks
  if (!isOpen) return null;

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
                <ul className="list-group list-group-flush filter-model-left">
                  {categoriesWithPrice.map((cat, index) => {
                    const isSelected = cat.id === selectedCategory?.id;
                    return (
                      <li 
                        key={cat.id} 
                        className={`list-group-item filter-popup-li ${isSelected ? 'active bg-primary text-white' : ''}`}
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center">
                          {cat.id === 'price-filter' && (
                            <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                          )}
                          {cat.single_data?.name || 'Unnamed Category'}
                          {cat.id === 'price-filter' && isPriceFilterActive && (
                            <span className="badge bg-white text-primary rounded-pill ms-2">
                              1
                            </span>
                          )}
                        </div>
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
                    
                    {/* PRICE FILTER CONTENT */}
                    {selectedCategory.id === 'price-filter' ? (
                      <div className="mt-4 p-0">
                        <div className="mb-4">
                          <h6 className="mb-3">Select Price Range</h6>
                          
                          {/* Price Range Slider */}
                          <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                              <div className="price-range-label">
                                <small className="text-muted">Range:</small>
                                <div className="fw-bold">
                                  ${tempPriceRange.min.toFixed(2)} - ${tempPriceRange.max.toFixed(2)}
                                </div>
                              </div>
                              <div className="price-range-minmax">
                                <small className="text-muted">
                                  ${minPriceRange.toFixed(2)} - ${maxPriceRange.toFixed(2)}
                                </small>
                              </div>
                            </div>
                            
                            {/* Slider Container */}
                            <div 
                              ref={sliderRef}
                              className="price-slider-container position-relative"
                              style={{
                                height: '24px',
                                width: '100%',
                                cursor: 'pointer',
                                touchAction: 'none' // Prevent browser touch actions
                              }}
                            >
                              {/* Slider Track Background */}
                              <div 
                                className="position-absolute bg-light rounded-pill"
                                style={{
                                  top: '50%',
                                  left: '0',
                                  right: '0',
                                  height: '4px',
                                  transform: 'translateY(-50%)'
                                }}
                              />
                              
                              {/* Slider Track Fill */}
                              <div 
                                className="position-absolute bg-primary rounded-pill"
                                style={{
                                  top: '50%',
                                  height: '4px',
                                  transform: 'translateY(-50%)',
                                  ...getTrackFillPosition()
                                }}
                              />
                              
                              {/* Min Thumb */}
                              <div
                                ref={minThumbRef}
                                className="position-absolute bg-white border border-primary rounded-circle shadow-sm"
                                style={{
                                  top: '50%',
                                  left: `${getMinThumbPosition()}%`,
                                  width: '20px',
                                  height: '20px',
                                  transform: 'translate(-50%, -50%)',
                                  cursor: isPriceDragging === 'min' ? 'grabbing' : 'grab',
                                  zIndex: 2
                                }}
                                onMouseDown={handleMouseDown('min')}
                                onTouchStart={handleTouchStart('min')}
                              />
                              
                              {/* Max Thumb */}
                              <div
                                ref={maxThumbRef}
                                className="position-absolute bg-white border border-primary rounded-circle shadow-sm"
                                style={{
                                  top: '50%',
                                  left: `${getMaxThumbPosition()}%`,
                                  width: '20px',
                                  height: '20px',
                                  transform: 'translate(-50%, -50%)',
                                  cursor: isPriceDragging === 'max' ? 'grabbing' : 'grab',
                                  zIndex: 2
                                }}
                                onMouseDown={handleMouseDown('max')}
                                onTouchStart={handleTouchStart('max')}
                              />
                            </div>
                            
                            {/* Slider Value Display */}
                            <div className="d-flex justify-content-between mt-2">
                              <div className="text-muted small">${minPriceRange.toFixed(2)}</div>
                              <div className="text-muted small">${maxPriceRange.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          {/* Manual Input Fields */}
                          <div className="row g-3 mb-3">
                            <div className="col-6">
                              <label htmlFor="minPrice" className="form-label text-muted small">
                                Minimum Price ($)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">$</span>
                                <input
                                  type="text"
                                  id="minPrice"
                                  className="form-control"
                                  placeholder="0.00"
                                  value={priceRange.min}
                                  onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                  onBlur={() => {
                                    if (validatePriceRange()) {
                                      applyPriceFilter();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            <div className="col-6">
                              <label htmlFor="maxPrice" className="form-label text-muted small">
                                Maximum Price ($)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">$</span>
                                <input
                                  type="text"
                                  id="maxPrice"
                                  className="form-control"
                                  placeholder="1000.00"
                                  value={priceRange.max}
                                  onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                  onBlur={() => {
                                    if (validatePriceRange()) {
                                      applyPriceFilter();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {priceError && (
                            <div className="alert alert-danger py-2">
                              <small>{priceError}</small>
                            </div>
                          )}
                          
                          <div className="d-flex gap-2 mt-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={applyPriceFilter}
                              disabled={!priceRange.min.trim() && !priceRange.max.trim()}
                            >
                              Apply Price Filter
                            </button>
                            
                            {isPriceFilterActive && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={clearPriceFilter}
                              >
                                Clear Price
                              </button>
                            )}
                          </div>
                          
                          {/* Quick price suggestions */}
                          <div className="mt-4 pt-3 border-top">
                            <p className="small text-muted mb-2">Quick Filters:</p>
                            <div className="d-flex flex-wrap gap-2">
                              {[
                                { label: 'Under $25', min: '', max: '25' },
                                { label: '$25 - $50', min: '25', max: '50' },
                                { label: '$50 - $100', min: '50', max: '100' },
                                { label: '$100 - $250', min: '100', max: '250' },
                                { label: '$250 - $500', min: '250', max: '500' },
                                { label: 'Over $500', min: '500', max: '' }
                              ].map((range, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleQuickFilterSelect(range.min, range.max)}
                                >
                                  {range.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* REGULAR FILTER CONTENT */
                      selectedSubCategory && Array.isArray(selectedSubCategory) ? (
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
                      )
                    )}

                    {/* Active Filters Summary */}
                    {getActiveFiltersCount() > 0 && (
                      <div className="mt-4 border-top pt-3">
                        <h6 className="mb-2">Active Filters:</h6>
                        <div className="d-flex flex-column gap-2">
                          {/* Price Filter Badge */}
                          {isPriceFilterActive && (
                            <div className="mb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold text-capitalize">Price:</span>
                                <button 
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={clearPriceFilter}
                                >
                                  Clear
                                </button>
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                <span className="badge bg-primary bg-opacity-10 rounded-pill px-3 py-2 d-flex align-items-center gap-1">
                                  {priceRange.min ? `$${priceRange.min}` : 'Min'}
                                  {' - '}
                                  {priceRange.max ? `$${priceRange.max}` : 'Max'}
                                  <button 
                                    type="button"
                                    className="btn-close0 btn-close-sm text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearPriceFilter();
                                    }}
                                    aria-label="Remove"
                                  >
                                    <FontAwesomeIcon icon={faXmark} />
                                  </button>
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Other Filters */}
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
                                        className="btn-close0 btn-close-sm text-white"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeFilterValue(filterKey, value);
                                        }}
                                        aria-label="Remove"
                                      >
                                        <FontAwesomeIcon icon={faXmark} />
                                      </button>
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
                <div 
                  className="w-100 text-primary cursor-pointer p-3 text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={applyFilters}
                >
                  <span className='text-primary fw-bold'>APPLY</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="badge bg-primary text-white rounded-pill ms-2">
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