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
            <Image height={40} width={40} 
              src={slide.image_url} 
              alt={slide.heading}
              loading="lazy"
            />
          </div>
          <div className="content-section col-md-6">
            <div className="content">
              <h2>{slide.heading}</h2>
              <p>{slide.sub_heading}</p>
              <Link href={slide.url} className="btn-custom">Shop Collection</Link>
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
      {/* <div className="container0 mt-3">

        <div id="imageContentSlider" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">

            <div className="carousel-item active">
              <div className="row g-0">
                <div className="col-md-6">
                  <Image width={747} height={594} src="/img/CSDCover_26Sep(1).webp" className="img-fluid" alt="Slide 1"/>
                </div>
                <div className="col-md-6 bg-white carousel-content">
                  <div className="content-slider">
                    <h2 className="text-left text-color">Affordable fashion deals for all seasons and styles</h2>
                    <h5 className="text-left text-color">Trendy fashion at unbeatable prices!</h5>
                    <div className="text-center mt-4">
                      <Link href="#" className="text-center text-color">Go Get It</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <div className="row g-0">
                <div className="col-md-6">
                  <Image width={747} height={594} src="/img/PreBootLaunchCover_3Sep(1).webp" className="img-fluid" alt="Slide 2"/>
                </div>
                <div className="col-md-6 bg-white carousel-content">
                  <div className="content-slider">
                    <h2 className="text-left text-color">Step into the season early</h2>
                    <h5 className="text-left text-color">Our new boots are here.</h5>
                    <div className="text-center mt-4">
                      <Link href="#" className="text-center text-color">Go Get It</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="carousel-control-prev" data-bs-target="#imageContentSlider" data-bs-slide="prev">
            <span className="bi bi-chevron-left"></span>
          </span>
          <span className="carousel-control-next" data-bs-target="#imageContentSlider" data-bs-slide="next">
            <span className="bi bi-chevron-right"></span>
          </span>
        </div>

      </div> */}
    </section>
  );
};
