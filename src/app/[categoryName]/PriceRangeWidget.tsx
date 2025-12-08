// components/PriceRangeWidget.tsx
'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface PriceRangeWidgetProps {
  min?: number;
  max?: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  paramNames?: {
    min?: string;
    max?: string;
  };
  debounceTime?: number;
  onChange?: (min: number, max: number) => void; // Add this line
}

const PriceRangeWidget: React.FC<PriceRangeWidgetProps> = ({
  min = 0,
  max = 1000,
  step = 10,
  initialMin = 0,
  initialMax = 500,
  paramNames = { min: 'minprice', max: 'maxprice' },
  debounceTime = 300,
  onChange, // Add this line
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Use default param names if not provided
  const minParamName = paramNames.min || 'minprice';
  const maxParamName = paramNames.max || 'maxprice';
  
  // Get initial values from URL or props
  const urlMinStr = searchParams.get(minParamName);
  const urlMaxStr = searchParams.get(maxParamName);
  
  // Parse URL values to numbers safely
  const getUrlNumber = (value: string | null, defaultValue: number): number => {
    if (value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : Math.max(min, Math.min(max, parsed));
  };
  
  const [minValue, setMinValue] = useState<number>(
    getUrlNumber(urlMinStr, initialMin)
  );
  const [maxValue, setMaxValue] = useState<number>(
    getUrlNumber(urlMaxStr, initialMax)
  );
  
  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Update URL when values change (with debounce)
  const updateUrlParams = useCallback((newMin: number, newMax: number) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Only add min price if it's not the default
        if (newMin > min) {
          params.set(minParamName, newMin.toString());
        } else {
          params.delete(minParamName);
        }
        
        // Only add max price if it's not the default
        if (newMax < max) {
          params.set(maxParamName, newMax.toString());
        } else {
          params.delete(maxParamName);
        }
        
        // Update URL without causing a full page refresh
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        
        // Call the onChange callback if provided
        if (onChange) {
          onChange(newMin, newMax);
        }
      });
    }, debounceTime);

    setDebounceTimer(timer);
  }, [debounceTime, debounceTimer, searchParams, pathname, router, min, max, minParamName, maxParamName, onChange]);

  // Sync URL params on component mount and when URL changes
  useEffect(() => {
    // Update local state when URL params change
    if (urlMinStr !== null) {
      const parsedMin = parseInt(urlMinStr);
      if (!isNaN(parsedMin) && parsedMin >= min && parsedMin <= max) {
        setMinValue(parsedMin);
      }
    }
    
    if (urlMaxStr !== null) {
      const parsedMax = parseInt(urlMaxStr);
      if (!isNaN(parsedMax) && parsedMax >= min && parsedMax <= max) {
        setMaxValue(parsedMax);
      }
    }
  }, [urlMinStr, urlMaxStr, min, max]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Calculate percentage for progress bar
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    const clampedValue = Math.max(min, value);
    setMinValue(clampedValue);
    updateUrlParams(clampedValue, maxValue);
  }, [maxValue, step, min, updateUrlParams]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    const clampedValue = Math.min(max, value);
    setMaxValue(clampedValue);
    updateUrlParams(minValue, clampedValue);
  }, [minValue, step, max, updateUrlParams]);

  // Reset to defaults
  const handleReset = () => {
    const newMin = initialMin;
    const newMax = initialMax;
    
    setMinValue(newMin);
    setMaxValue(newMax);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete(minParamName);
    params.delete(maxParamName);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(newMin, newMax);
    }
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price: number) => {
    return `₹ ${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="pricing-range-widget widget-item">
      <div className="flex justify-between items-center mb-2">
        <h3 className="widget-title m-0">Price Range</h3>
        {(urlMinStr || urlMaxStr) && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            disabled={isPending}
          >
            Reset
          </button>
        )}
      </div>
      <div className="price-range-container">
        <div className="current-range mb-3">
          <span className="min-price">{formatPrice(minValue)}</span>
          <span className="max-price float-end">{formatPrice(maxValue)}</span>
        </div>
        <div className="range-slider relative h-2">
          <div className="slider-track absolute w-full h-full bg-gray-200 rounded-full"></div>
          <div 
            className="slider-progress absolute h-full bg-blue-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          ></div>
          <input
            type="range"
            className="min-range absolute w-full h-2 opacity-0 cursor-pointer z-10"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinChange}
            disabled={isPending}
          />
          <input
            type="range"
            className="max-range absolute w-full h-2 opacity-0 cursor-pointer z-10"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxChange}
            disabled={isPending}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>
      </div>
      {isPending && (
        <div className="text-xs text-gray-500 mt-1 animate-pulse">
          Updating...
        </div>
      )}
    </div>
  );
};

export default PriceRangeWidget;