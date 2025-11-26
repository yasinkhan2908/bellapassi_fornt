'use client';
import Image from "next/image";
import { SecondCategoryProps } from '../../types';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from 'next/link';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
export const SecondCategory = ({}: SecondCategoryProps) => {
  return (
    <section className="second-category-section" data-aos="fade-up">
        <div className="container">
         
            <div className="max-w-3xl mx-auto my-8 mt-4">
                
                <Swiper
                    spaceBetween={10}
                    breakpoints={{
                    0: { slidesPerView: 1 },
                    480: { slidesPerView: 1},
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    }}
                    modules={[Autoplay, Navigation, Pagination]}
                    slidesPerView={1}
                    loop={false}
                    autoplay={{ delay: 10000000 }}
                    pagination={{ clickable: true }}
                    navigation
                >
                <SwiperSlide className="text-center">
                    <div className="collection-item-v2 hover-img">
                        <Link href="/mordern-backpack" className="collection-inner">
                            <div className="collection-image img-style">
                                <Image height={425} width={472} className=" ls-is-cached lazyloaded" data-src="/img/collection-27.jpg" src="/img/collection-27.jpg" alt="collection-img" loading="lazy"/>
                            </div>
                            <div className="collection-content">
                                <div className="top wow fadeInUp">
                                    <h5 className="heading">Mordern Backpack</h5>
                                    <p className="subheading">Start from <span className="fw-6">$199</span></p>
                                </div>
                                <div className="bottom wow fadeInUp text-right">
                                    <div className="tf-btn btn-line collection-other-link fw-6">
                                        <span>Shop Now</span>
                                        <i className="icon icon-arrow1-top-left"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="text-center">
                    <div className="collection-item-v2 hover-img">
                        <Link href="/season-collection" className="collection-inner">
                            <div className="collection-image img-style">
                                <Image height={425} width={472} className=" ls-is-cached lazyloaded" data-src="/img/collection-28.jpg" src="/img/collection-28.jpg" alt="collection-img" loading="lazy"/>
                            </div>
                            <div className="collection-content">
                                <div className="top wow fadeInUp" data-wow-delay="0s" >
                                    <h5 className="heading">Season Collection</h5>
                                    <p className="subheading">Start from <span className="fw-6">$199</span></p>
                                </div>
                                <div className="bottom wow fadeInUp text-right" data-wow-delay="0s" >
                                    <div className="tf-btn btn-line collection-other-link fw-6">
                                        <span>Shop now</span>
                                        <i className="icon icon-arrow1-top-left"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="text-center">
                    <div className="collection-item-v2 hover-img">
                        <Link href="/stradivarius-top-trainers" className="collection-inner">
                            <div className="collection-image img-style">
                                <Image height={425} width={472} className=" ls-is-cached lazyloaded" data-src="/img/collection-26.jpg" src="/img/collection-26.jpg" alt="collection-img" loading="lazy"/>
                            </div>
                            <div className="collection-content">
                                <div className="top wow fadeInUp" data-wow-delay="0s" >
                                    <h5 className="heading">Stradivarius top trainers</h5>
                                    <p className="subheading">Start from <span className="fw-6">$199</span></p>
                                </div>
                                <div className="bottom wow fadeInUp text-right" data-wow-delay="0s" >
                                    <div className="tf-btn btn-line collection-other-link fw-6">
                                        <span>Shop now</span>
                                        <i className="icon icon-arrow1-top-left"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</section>
  );
};