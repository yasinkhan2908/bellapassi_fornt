"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'

interface SortingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortingOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Customer Rating" },
];

export default function SortingModal({ 
  isOpen, 
  onClose, 
  selectedSort, 
  onSelectSort 
}: SortingModalProps) {
  if (!isOpen) return null;

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
              onClick={() => {
                onSelectSort(option.value);
                onClose();
              }}
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