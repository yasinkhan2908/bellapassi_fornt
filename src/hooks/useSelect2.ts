// hooks/useSelect2.ts
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    $: any;
  }
}

const useSelect2 = (selector: string, dependencies: any[] = []) => {
  const initializedRef = useRef(false);
  
  useEffect(() => {
    const initializeSelect2 = () => {
      if (typeof window !== 'undefined' && window.$ && !initializedRef.current) {
        try {
          // Check if element exists
          const element = window.$(selector);
          if (element.length > 0) {
            // Destroy existing Select2 instance if any
            if (element.data('select2')) {
              element.select2('destroy');
            }
            
            // Initialize Select2
            element.select2({
              theme: 'bootstrap-5',
              width: '100%',
              placeholder: 'Select an option',
              allowClear: false
            });
            
            initializedRef.current = true;
            console.log(`Select2 initialized for ${selector}`);
          }
        } catch (error) {
          console.error(`Error initializing Select2 for ${selector}:`, error);
        }
      }
    };

    // Initial initialization
    initializeSelect2();

    // Reinitialize when dependencies change
    const timeoutId = setTimeout(() => {
      initializeSelect2();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined' && window.$) {
        try {
          const element = window.$(selector);
          if (element.length > 0 && element.data('select2')) {
            element.select2('destroy');
          }
        } catch (error) {
          console.error(`Error destroying Select2 for ${selector}:`, error);
        }
      }
    };
  }, [selector, ...dependencies]);
};

export default useSelect2;