'use client';
import Image from "next/image";
import { PromoSectionProps } from '../../types';

export const PromoSection = ({ title, items }: PromoSectionProps) => {
  return (
    <section className="best-sellers section" data-aos="fade-up">
      <div className="container">
        <h2 className="heading-line">{title}</h2>
        <div className="row gy-4">
          {items.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-6">
              <div className="product-item wardrobe-deal">
                <div className="product-image">
                  <Image width={40} height={40} 
                    src={item.image} 
                    alt={item.name} 
                    className="img-fluid" 
                    loading="lazy" 
                  />
                </div>
                <div className="product-info p-2 text-center">
                  <div className="product-category m-0">{item.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}