"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { ReactNode } from 'react';
import { Key } from 'node:readline';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  CateDatas: any[];
  bgColor?: any[];
}

export default function FilterModal({ isOpen, onClose, CateDatas }: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-container">
        <div className="filter-modal-header">
          <h3 className="filter-modal-title">Filters</h3>
          <span 
            className="text-primary"
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
                            const isLast = index === CateDatas.length - 1;
    
                            return (
                                <li key={cat.id} className="list-group-item filter-popup-li">{cat.single_data.name}</li>
                            );
                        })}
                    </ul>
                </div>

                {/* RIGHT SIDEBAR CONTENT */}
                <div className="col-7 p-4" style={{ height: "100vh", overflowY: "auto" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-check2 text-muted"></i>
                        <span>Ethnic dresses</span>
                        </div>
                        {/* <span className="text-muted small">1017</span> */}
                    </div>
                </div>
            </div>

            <div className="d-flex mobile-filter">
                    <div className="product-section col-6 mt-1 filter-sorting">
                      <div 
                        className="w-100" onClick={onClose}>
                        <span> Close</span>
                      </div>
                    </div>
                    <div className="product-section col-6 mt-1">
                      <span 
                        className="w-100 text-primary">
                        <span className='text-primary'> APPLY</span>
                      </span>
                    </div>
                  </div>
            </div>

        </div>

        {/* <div className="filter-modal-footer">
          <span>
            Filters
          </span>
        </div> */}
      </div>
    </div>
  );
}