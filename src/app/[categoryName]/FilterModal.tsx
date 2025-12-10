"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRupeeSign, faRuler } from '@fortawesome/free-solid-svg-icons'
import { ReactNode, useState, useEffect, useRef, useCallback, Key } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  CateDatas: any[];
  CateSizes: any[];
  bgColor?: any[];
  selectedFilters?: any[];
  minPriceRange?: number;
  maxPriceRange?: number;
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  CateDatas, 
  CateSizes,
  minPriceRange = 0, 
  maxPriceRange = 10000
}: FilterModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Add ref for right sidebar scrolling
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  
  // Store filters as Map<filterKey, Set<values>>
  const [activeFilters, setActiveFilters] = useState<Map<string, Set<string>>>(new Map());
  
  // Price filter state
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: ''
  });
  const [sliderValues, setSliderValues] = useState<{ min: number; max: number }>({
    min: minPriceRange,
    max: maxPriceRange
  });
  const [priceError, setPriceError] = useState<string>('');
  const [activeSlider, setActiveSlider] = useState<'min' | 'max' | null>(null);
  
  // Size filter state
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);

  // Extract available sizes from CateSizes
  const availableSizes = CateSizes
    .map(item => item.size ?? "")
    .filter(size => size.trim() !== "");
  
  // Create size category object
  const sizeCategory = {
    id: 'size-filter',
    single_data: {
      name: 'Size',
      field_option: availableSizes
    }
  };

  // Create categories with price and size
  const categoriesWithPriceAndSize = [
    ...CateDatas,
    {
      id: 'price-filter',
      single_data: {
        name: 'Price',
        field_option: 'price_range'
      }
    },
    sizeCategory
  ];

  // Initialize active filters, price range, and sizes from URL on component mount
  useEffect(() => {
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      const filtersMap = new Map<string, Set<string>>();
      let minPrice = '';
      let maxPrice = '';
      let tempMin = minPriceRange;
      let tempMax = maxPriceRange;
      const sizesSet = new Set<string>();
      
      params.forEach((value, key) => {
        if (key === 'minprice') {
          minPrice = value;
          const minValue = parseFloat(value);
          if (!isNaN(minValue)) {
            tempMin = Math.max(minPriceRange, Math.min(maxPriceRange, minValue));
          }
        } else if (key === 'maxprice') {
          maxPrice = value;
          const maxValue = parseFloat(value);
          if (!isNaN(maxValue)) {
            tempMax = Math.max(minPriceRange, Math.min(maxPriceRange, maxValue));
          }
        } else if (key === 'size' || key === 'sizes') {
          // Handle size filter
          const sizeValues = value.split(',').filter(v => v.trim() !== '');
          sizeValues.forEach(size => sizesSet.add(size));
        } else if (key.startsWith('')) {
          // Split comma-separated values for other filters
          const values = value.split(',').filter(v => v.trim() !== '');
          if (values.length > 0) {
            filtersMap.set(key, new Set(values));
          }
        }
      });
      
      setActiveFilters(filtersMap);
      setSelectedSizes(sizesSet);
      setPriceRange({ min: minPrice, max: maxPrice });
      setSliderValues({ min: tempMin, max: tempMax });
    }
  }, [searchParams, minPriceRange, maxPriceRange]);

  // Initialize selected category when modal opens or when categories data changes
  useEffect(() => {
    if (categoriesWithPriceAndSize.length > 0 && !selectedCategory && isOpen) {
      // Select the first category by default
      const firstCategory = categoriesWithPriceAndSize[0];
      setSelectedCategory(firstCategory);
      
      // Set the appropriate subcategory based on the category type
      if (firstCategory.id === 'price-filter') {
        setSelectedSubCategory('price_range');
      } else if (firstCategory.id === 'size-filter') {
        setSelectedSubCategory('size_options');
      } else if (firstCategory.single_data?.field_option) {
        // Check if field_option is an array
        const fieldOption = firstCategory.single_data.field_option;
        if (Array.isArray(fieldOption)) {
          setSelectedSubCategory(fieldOption);
        } else {
          setSelectedSubCategory(null);
        }
      } else {
        setSelectedSubCategory(null);
      }
      
      // Scroll to top when first category is selected
      setTimeout(() => {
        if (rightSidebarRef.current) {
          rightSidebarRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [categoriesWithPriceAndSize, selectedCategory, isOpen]);

  // Also reset when modal opens
  useEffect(() => {
    if (isOpen && categoriesWithPriceAndSize.length > 0) {
      // Reset to first category when modal opens
      const firstCategory = categoriesWithPriceAndSize[0];
      setSelectedCategory(firstCategory);
      
      if (firstCategory.id === 'price-filter') {
        setSelectedSubCategory('price_range');
      } else if (firstCategory.id === 'size-filter') {
        setSelectedSubCategory('size_options');
      } else if (firstCategory.single_data?.field_option && Array.isArray(firstCategory.single_data.field_option)) {
        setSelectedSubCategory(firstCategory.single_data.field_option);
      } else {
        setSelectedSubCategory(null);
      }
      
      // Scroll to top when modal opens
      setTimeout(() => {
        if (rightSidebarRef.current) {
          rightSidebarRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen]);

  // UPDATED: Fixed handleCategoryClick with proper scrolling
  const handleCategoryClick = (category: any) => {
    console.log('Category clicked:', category.single_data?.name);
    
    if (category.id === 'price-filter') {
      setSelectedCategory(category);
      setSelectedSubCategory('price_range');
    } else if (category.id === 'size-filter') {
      setSelectedCategory(category);
      setSelectedSubCategory('size_options');
    } else {
      setSelectedCategory(category);
      // Check if field_option is an array
      if (category.single_data?.field_option && Array.isArray(category.single_data.field_option)) {
        setSelectedSubCategory(category.single_data.field_option);
      } else {
        setSelectedSubCategory(null);
      }
    }
    
  };

  useEffect(() => {
    modalOverlayRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [selectedCategory, selectedSubCategory]);

  // Rest of your functions remain the same...
  const applySizeFilter = () => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove existing size parameters
    params.delete('size');
    params.delete('sizes');
    
    // Add selected sizes if any
    if (selectedSizes.size > 0) {
      const sizesArray = Array.from(selectedSizes);
      params.set('size', sizesArray.join(','));
    }
    
    // Add current active filters with comma-separated values
    activeFilters.forEach((values, key) => {
      if (values.size > 0) {
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Update price filters
    if (priceRange.min.trim()) {
      params.set('minprice', priceRange.min);
    } else {
      params.delete('minprice');
    }
    
    if (priceRange.max.trim()) {
      params.set('maxprice', priceRange.max);
    } else {
      params.delete('maxprice');
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearSizeFilter = () => {
    setSelectedSizes(new Set());
    
    // Update URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('size');
    params.delete('sizes');
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const applyPriceFilter = () => {
    if (!validatePriceRange()) return;
    
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters except size
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'minprice' && key !== 'maxprice' && key !== 'size' && key !== 'sizes') {
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
    
    // Add size filter if selected
    if (selectedSizes.size > 0) {
      const sizesArray = Array.from(selectedSizes);
      params.set('size', sizesArray.join(','));
    }
    
    // Update or remove minprice parameter
    if (priceRange.min.trim()) {
      params.set('minprice', priceRange.min);
    } else {
      params.delete('minprice');
    }
    
    // Update or remove maxprice parameter
    if (priceRange.max.trim()) {
      params.set('maxprice', priceRange.max);
    } else {
      params.delete('maxprice');
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearPriceFilter = () => {
    setPriceRange({ min: '', max: '' });
    setSliderValues({ min: minPriceRange, max: maxPriceRange });
    setPriceError('');
    
    // Update URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters except non-price filters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'minprice' && key !== 'maxprice' && key !== 'size' && key !== 'sizes') {
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
    
    // Add size filter if selected
    if (selectedSizes.size > 0) {
      const sizesArray = Array.from(selectedSizes);
      params.set('size', sizesArray.join(','));
    }
    
    // Remove price params
    params.delete('minprice');
    params.delete('maxprice');
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const updateURLWithFilters = (filters: Map<string, Set<string>>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters (except price and size)
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') && key !== 'minprice' && key !== 'maxprice' && key !== 'size' && key !== 'sizes') {
        params.delete(key);
      }
    });
    
    // Add current active filters with comma-separated values
    filters.forEach((values, key) => {
      if (values.size > 0) {
        const valuesArray = Array.from(values);
        params.set(key, valuesArray.join(','));
      }
    });
    
    // Add size filter if selected
    if (selectedSizes.size > 0) {
      const sizesArray = Array.from(selectedSizes);
      params.set('size', sizesArray.join(','));
    } else {
      params.delete('size');
      params.delete('sizes');
    }
    
    // Update URL
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  const clearAllFilters = () => {
    setActiveFilters(new Map());
    setSelectedSizes(new Set());
    setSelectedCategory(categoriesWithPriceAndSize[0] || null);
    setSelectedSubCategory(null);
    setPriceRange({ min: '', max: '' });
    setSliderValues({ min: minPriceRange, max: maxPriceRange });
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
    
    // Add size filters to count if they exist
    if (selectedSizes.size > 0) {
      count += 1;
    }
    
    return count;
  };

  const applyFilters = () => {
    // Apply all filters including price and size
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    // Remove all existing filter parameters
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('') || key === 'minprice' || key === 'maxprice' || key === 'size' || key === 'sizes') {
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
    
    // Add size filter if selected
    if (selectedSizes.size > 0) {
      const sizesArray = Array.from(selectedSizes);
      params.set('size', sizesArray.join(','));
    }
    
    // Add price filters if they exist
    if (priceRange.min.trim()) {
      params.set('minprice', priceRange.min);
    }
    if (priceRange.max.trim()) {
      params.set('maxprice', priceRange.max);
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
    
    console.log('Applied filters:', {
      category: selectedCategory?.single_data?.name,
      priceRange: priceRange,
      sizes: Array.from(selectedSizes),
      activeFilters: Object.fromEntries(Array.from(activeFilters.entries()).map(([key, values]) => [key, Array.from(values)]))
    });
    onClose();
  };

  // Check if price filter is currently active
  const isPriceFilterActive = priceRange.min.trim() !== '' || priceRange.max.trim() !== '';

  // Check if size filter is currently active
  const isSizeFilterActive = selectedSizes.size > 0;

  // Handle size selection from checkbox
  const handleSizeChange = (sizeValue: string) => {
    setIsUpdatingFilters(true);
    
    const newSelectedSizes = new Set(selectedSizes);
    
    if (newSelectedSizes.has(sizeValue)) {
      newSelectedSizes.delete(sizeValue);
    } else {
      newSelectedSizes.add(sizeValue);
    }
    
    setSelectedSizes(newSelectedSizes);
    
    // Apply filter immediately when size is selected/deselected
    setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      
      // Update size parameter
      if (newSelectedSizes.size > 0) {
        const sizesArray = Array.from(newSelectedSizes);
        params.set('size', sizesArray.join(','));
      } else {
        params.delete('size');
        params.delete('sizes');
      }
      
      const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      router.push(newUrl, { scroll: false });
      
      setIsUpdatingFilters(false);
    }, 50);
  };

  // Handle quick filter selection for price
  const handleQuickFilterSelect = (min: string, max: string) => {
    const newPriceRange = {
      min: min,
      max: max
    };
    
    setPriceRange(newPriceRange);
    
    // Update slider values
    const minNum = min ? parseFloat(min) : minPriceRange;
    const maxNum = max ? parseFloat(max) : maxPriceRange;
    
    if (!isNaN(minNum) && !isNaN(maxNum)) {
      setSliderValues({
        min: Math.max(minPriceRange, minNum),
        max: Math.min(maxPriceRange, maxNum)
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
    
    // Also update slider values if valid number
    const numValue = parseFloat(numericValue);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(minPriceRange, Math.min(maxPriceRange, numValue));
      setSliderValues(prev => ({
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

  // FIXED: Better slider change handler
  const handleSliderChange = (type: 'min' | 'max', value: number) => {
    console.log("Slider change:", type, value);
    
    setSliderValues(prev => {
      let newMin = prev.min;
      let newMax = prev.max;
      
      if (type === 'min') {
        // Ensure min doesn't exceed max
        newMin = Math.min(value, prev.max);
        // Clamp to range
        newMin = Math.max(minPriceRange, newMin);
      } else {
        // Ensure max doesn't go below min
        newMax = Math.max(value, prev.min);
        // Clamp to range
        newMax = Math.min(maxPriceRange, newMax);
      }
      
      // Update priceRange state
      setPriceRange(p => ({
        ...p,
        min: type === 'min' ? newMin.toString() : p.min,
        max: type === 'max' ? newMax.toString() : p.max
      }));
      
      return { min: newMin, max: newMax };
    });
  };

  const handleSliderStart = (type: 'min' | 'max') => {
    setActiveSlider(type);
  };

  const handleSliderEnd = () => {
    setActiveSlider(null);
    // Apply filter when user stops dragging
    if (validatePriceRange()) {
      applyPriceFilter();
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
      setPriceError(`Price must be between ₹${minPriceRange} and ₹${maxPriceRange}`);
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

  const handleSubCategoryClick = (subcat: any, categoryName: string) => {
    const filterKey = `${categoryName}`;
    const filterValue = typeof subcat === 'string' ? subcat : (subcat.value || subcat.id || subcat.name);
    
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

  // Calculate slider positions for visual track
  const getTrackFillPosition = () => {
    const minPos = ((sliderValues.min - minPriceRange) / (maxPriceRange - minPriceRange)) * 100;
    const maxPos = ((sliderValues.max - minPriceRange) / (maxPriceRange - minPriceRange)) * 100;
    return {
      left: `${minPos}%`,
      width: `${maxPos - minPos}%`
    };
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
        
        <div className="filter-modal-content p-0" ref={modalOverlayRef} style={{ overflowY: "auto", height: "100%" }}>
          <div className="container-fluid p-0" style={{ height: "100%" }}>
            <div className="row g-0">
              {/* LEFT SIDEBAR */}
              <div className="col-5 border-end bg-light" style={{ height: "100vh", overflowY: "auto" }}>
                <ul className="list-group list-group-flush filter-model-left">
                  {categoriesWithPriceAndSize.map((cat, index) => {
                    const isSelected = cat.id === selectedCategory?.id;
                    let badgeCount = 0;
                    
                    if (cat.id === 'price-filter' && isPriceFilterActive) {
                      badgeCount = 1;
                    } else if (cat.id === 'size-filter' && isSizeFilterActive) {
                      badgeCount = 1;
                    } else if (cat.id !== 'price-filter' && cat.id !== 'size-filter') {
                      // For regular categories
                      const filterKey = cat.single_data?.name;
                      if (filterKey) {
                        const filterValues = activeFilters.get(filterKey);
                        if (filterValues && filterValues.size > 0) {
                          badgeCount = filterValues.size;
                        }
                      }
                    }
                    
                    return (
                      <li 
                        key={cat.id} 
                        className={`list-group-item filter-popup-li ${isSelected ? 'active bg-primary text-white' : ''}`}
                        onClick={() => handleCategoryClick(cat)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            {cat.id === 'price-filter' && (
                              <span className='price-sign-text-color mr-2'>₹</span>
                            )}
                            {cat.id === 'size-filter' && (
                              <FontAwesomeIcon icon={faRuler} className="me-2" />
                            )}
                            {cat.single_data?.name || 'Unnamed Category'}
                          </div>
                          {badgeCount > 0 && (
                            <span className="badge bg-white text-primary rounded-pill">
                              {badgeCount}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* RIGHT SIDEBAR CONTENT - ADDED REF HERE */}
              <div 
                ref={rightSidebarRef}
                className="col-7 p-4" 
                style={{ height: "100vh", overflowY: "auto" }}
              >
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
                          
                          {/* Price Range Slider - IMPROVED VERSION */}
                          <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                              <div className="price-range-label">
                                <small className="text-muted">Range:</small>
                                <div className="fw-bold">
                                  ₹ {sliderValues.min.toFixed(2)} - ₹ {sliderValues.max.toFixed(2)}
                                </div>
                              </div>
                              <div className="price-range-minmax d-none">
                                <small className="text-muted">
                                  ₹ {minPriceRange.toFixed(2)} - ₹ {maxPriceRange.toFixed(2)}
                                </small>
                              </div>
                            </div>
                            
                            {/* Dual Range Slider Container - FIXED VERSION */}
                            <div className="price-slider-container position-relative py-3" style={{ height: '40px' }}>
                              {/* Slider Track Background */}
                              <div 
                                className="position-absolute bg-light rounded-pill"
                                style={{
                                  top: '50%',
                                  left: '0',
                                  right: '0',
                                  height: '6px',
                                  transform: 'translateY(-50%)'
                                }}
                              />
                              
                              {/* Slider Track Fill */}
                              <div 
                                className="position-absolute bg-primary rounded-pill"
                                style={{
                                  top: '50%',
                                  height: '6px',
                                  transform: 'translateY(-50%)',
                                  ...getTrackFillPosition()
                                }}
                              />
                              
                              {/* Min Price Slider - FIXED: Better positioning */}
                              <div className="position-relative" style={{ height: '100%' }}>
                                <input
                                  type="range"
                                  min={minPriceRange}
                                  max={maxPriceRange}
                                  value={sliderValues.min}
                                  onChange={(e) => handleSliderChange('min', parseInt(e.target.value))}
                                  onMouseDown={() => handleSliderStart('min')}
                                  onMouseUp={handleSliderEnd}
                                  onTouchStart={() => handleSliderStart('min')}
                                  onTouchEnd={handleSliderEnd}
                                  className="position-absolute"
                                  style={{
                                    width: '100%',
                                    height: '40px',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    zIndex: activeSlider === 'min' ? 5 : 3,
                                    top: 0,
                                    left: 0
                                  }}
                                />
                                
                                {/* Min Thumb Visual */}
                                <div
                                  className="position-absolute bg-white border border-primary rounded-circle shadow-sm"
                                  style={{
                                    top: '50%',
                                    left: `${((sliderValues.min - minPriceRange) / (maxPriceRange - minPriceRange)) * 100}%`,
                                    width: '24px',
                                    height: '24px',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'grab',
                                    zIndex: 4,
                                    pointerEvents: 'none'
                                  }}
                                />
                              </div>
                              
                              {/* Max Price Slider - FIXED: Better positioning */}
                              <div className="position-relative" style={{ height: '100%' }}>
                                <input
                                  type="range"
                                  min={minPriceRange}
                                  max={maxPriceRange}
                                  value={sliderValues.max}
                                  onChange={(e) => handleSliderChange('max', parseInt(e.target.value))}
                                  onMouseDown={() => handleSliderStart('max')}
                                  onMouseUp={handleSliderEnd}
                                  onTouchStart={() => handleSliderStart('max')}
                                  onTouchEnd={handleSliderEnd}
                                  className="position-absolute"
                                  style={{
                                    width: '100%',
                                    height: '40px',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    zIndex: activeSlider === 'max' ? 5 : 3,
                                    top: 0,
                                    left: 0
                                  }}
                                />
                                
                                {/* Max Thumb Visual */}
                                <div
                                  className="position-absolute bg-white border border-primary rounded-circle shadow-sm"
                                  style={{
                                    top: '50%',
                                    left: `${((sliderValues.max - minPriceRange) / (maxPriceRange - minPriceRange)) * 100}%`,
                                    width: '24px',
                                    height: '24px',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'grab',
                                    zIndex: 4,
                                    pointerEvents: 'none'
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* Slider Value Display */}
                            <div className="d-flex justify-content-between mt-2">
                              <div className="text-muted small">₹{minPriceRange.toFixed(2)}</div>
                              <div className="text-muted small">₹{maxPriceRange.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          {/* Manual Input Fields */}
                          <div className="row g-3 mb-3 mobile-min-max-input-price">
                            <div className="col-6">
                              <label htmlFor="minPrice" className="form-label text-muted small">
                                Minimum Price (₹)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">₹</span>
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
                                Maximum Price (₹)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text bg-light">₹</span>
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
                          
                          <div className="d-flex gap-2 mt-3  d-none">
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
                          <div className="mt-4 pt-3 border-top mobile-quick-filter-price">
                            <p className="small text-muted mb-2">Quick Filters:</p>
                            <div className="d-flex flex-wrap gap-2">
                              {[
                                { label: 'Under ₹25', min: '', max: '25' },
                                { label: '₹25 - ₹50', min: '25', max: '50' },
                                { label: '₹50 - ₹100', min: '50', max: '100' },
                                { label: '₹100 - ₹250', min: '100', max: '250' },
                                { label: '₹250 - ₹500', min: '250', max: '500' },
                                { label: 'Over ₹500', min: '500', max: '' }
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
                    ) : selectedCategory.id === 'size-filter' ? (
                      /* SIZE FILTER CONTENT - USING YOUR CHECKBOX DESIGN */
                      <div className="mt-4 p-0">
                        <div className="mb-4">
                          <h6 className="mb-3">Select Sizes</h6>
                          
                          {/* Size Selection Grid with Checkboxes */}
                          <div className="size-filter-grid mb-4">
                            <div className="d-flex flex-wrap gap-3">
                              {CateSizes.map((sizeItem: { size: string; id: Key | null | undefined; }) => {
                                const sizeValue = sizeItem.size ?? "";
                                const sizeId = sizeItem.id ?? `size-${sizeValue}`;
                                const isSelected = selectedSizes.has(sizeValue);
                                
                                return (
                                  <div className="brand-item" key={sizeId}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="size-selection"
                                        id={`size-${sizeId}`}
                                        value={sizeValue}
                                        data-filter='size'
                                        checked={isSelected}
                                        onChange={() => handleSizeChange(sizeValue)}
                                        disabled={isUpdatingFilters}
                                      />
                                      <label 
                                        className="form-check-label" 
                                        htmlFor={`size-${sizeId}`}
                                      >
                                        {sizeValue || "Unknown Size"}
                                      </label>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Size Guide Link (Optional) */}
                          <div className="mt-4 pt-3 border-top d-none">
                            <p className="small text-muted mb-2">
                              Need help with sizing? 
                              <a href="/size-guide" className="text-primary ms-1" target="_blank" rel="noopener noreferrer">
                                View our size guide
                              </a>
                            </p>
                          </div>
                          
                          {/* Size Filter Actions */}
                          <div className="d-flex gap-2 mt-3 d-none">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={applySizeFilter}
                              disabled={selectedSizes.size === 0}
                            >
                              Apply Size Filter
                            </button>
                            
                            {isSizeFilterActive && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={clearSizeFilter}
                              >
                                Clear Sizes
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* REGULAR FILTER CONTENT */
                      selectedSubCategory && Array.isArray(selectedSubCategory) ? (
                        <div className="mt-4 p-0">
                          <ul className="list-group list-group-flush">
                            {selectedSubCategory.map((subcat: any, index: number) => {
                              const subcatValue = typeof subcat === 'string' ? subcat : (subcat.value || subcat.id || `option_${index}`);
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
                                      {typeof subcat === 'string' ? subcat : (subcat.value || `Option ${index + 1}`)}
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
                                  {priceRange.min ? `₹${priceRange.min}` : 'Min'}
                                  {' - '}
                                  {priceRange.max ? `₹${priceRange.max}` : 'Max'}
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
                          
                          {/* Size Filter Badge */}
                          {isSizeFilterActive && (
                            <div className="mb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold text-capitalize">Size:</span>
                                <button 
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={clearSizeFilter}
                                >
                                  Clear All
                                </button>
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                {Array.from(selectedSizes).map((size, index) => (
                                  <span 
                                    key={index}
                                    className="badge bg-primary bg-opacity-10 rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                                  >
                                    {size}
                                    <button 
                                      type="button"
                                      className="btn-close0 btn-close-sm text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSizeChange(size);
                                      }}
                                      aria-label="Remove"
                                    >
                                      <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                  </span>
                                ))}
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
                    <div className="text-muted">Loading filters...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex mobile-filter open-mobile-filter border-top">
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