'use client';
import Image from "next/image";
import { CategorySectionProps } from '../../types';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

export const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="category-section" data-aos="fade-up">
      <div className="container">
        <div className="max-w-3xl mx-auto my-8 mt-4">
          <div className="d-flex flat-title flex-row justify-content-between align-items-center px-0 wow fadeInUp mb-5">
            <h3 className="title">Season Collection</h3>
            <Link href="shop-collection-sub.html" className="tf-btn btn-line" prefetch={false}>
              View all<i className="bi bi-arrow-right pl-2"></i>
            </Link>
          </div>
          <Swiper
            breakpoints={{
              0: { slidesPerView: 2 },
              480: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            loop={false}
            autoplay={{ delay: 10000000 }}
            pagination={{ clickable: true }}
            navigation
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className="text-center">
                <Link href={category.seo} prefetch={false}>
                  <div className="relative aspect-square w-full max-w-[84px] mx-auto">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 84px, (max-width: 768px) 84px, (max-width: 1024px) 84px, 84px"
                      className="object-cover img-fluid rounded-full"
                      quality={75}
                      loading="lazy"
                    />
                  </div>
                  <div className="text-center category-title">{category.name}</div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};