'use client';
import { SliderSectionProps } from '../../types';
import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from "next/link";
export const HeroSection = ({ sliders }: SliderSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = sliders;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index:any) => {
    setCurrentSlide(index);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className='hero-section'>
      <div className="slider-container">
      

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slider-item ${index === currentSlide ? 'active' : ''}`}
        >
          <div className="image-section col-md-6">
            <Image 
              height={40} 
              width={40} 
              src={slide.image_url} 
              alt={slide.heading}
              loading="eager"  // or remove this line if using priority
              priority={index === 0}  // This is crucial - adds fetchpriority="high"
            />
          </div>
          <div className="content-section col-md-6">
            <div className="content">
              <h2>{slide.heading}</h2>
              <p>{slide.sub_heading}</p>
              <Link href={slide.url} className="btn-custom" prefetch={false}>Shop Collection</Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slider Controls */}
      <div className="slider-controls">
        <button onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      {/* Slider Indicators */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === currentSlide ? 'active' : ''}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
    </section>
  );
};
