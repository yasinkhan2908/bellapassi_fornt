"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation';

// Define the interface properly
interface SortingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortingOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function SortingModal({ 
  isOpen, 
  onClose, 
  selectedSort, 
  onSelectSort 
}: SortingModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleSortSelect = (sortValue: string) => {
    // Get current URL from window.location
    const currentUrl = new URL(window.location.href);
    
    // Update or set the sort parameter
    currentUrl.searchParams.set('sort', sortValue);
    
    // Construct the new URL
    const newUrl = `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`;
    
    // Update the URL
    router.push(newUrl, { scroll: false });
    
    // Call the callback functions
    onClose();
  };

  return (
    <div className="sorting-modal-overlay">
      <div className="sorting-modal-container">
        <div className="sorting-modal-header">
          <h3 className="sorting-modal-title">Sort By</h3>
          <button 
            className="sorting-modal-close-btn"
            onClick={onClose}
            aria-label="Close sorting modal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        
        <div className="sorting-modal-content">
          {sortingOptions.map((option) => (
            <div 
              key={option.value}
              className={`sorting-option ${selectedSort === option.value ? 'selected' : ''}`}
              onClick={() => handleSortSelect(option.value)}
            >
              <span className="sorting-option-label">{option.label}</span>
              {selectedSort === option.value && (
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}