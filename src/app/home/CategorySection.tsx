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
              <Link href="shop-collection-sub.html" className="tf-btn btn-line">View all categories<i className="bi bi-arrow-right pl-2"></i></Link>
          </div>
          <Swiper
            breakpoints={{
              0: { slidesPerView: 2 },
              480: { slidesPerView: 2},
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
            {categories.map((category, index) => (
              <SwiperSlide  key={category.id} className="text-center">
                <Link href={category.seo}>
                  <Image src={category.image} height={175} width={175} alt="Slide 1" loading="lazy" />
                  <div className="text-center category-title">{category.name}</div>
                  <div className="text-center category-subtitle">0 items</div>
                </Link>
              </SwiperSlide>
            ))}
            {/* <SwiperSlide className="text-center">
              <Link href="/shoes">
                <Image src="/img/shoes.webp" height={175} width={175} alt="Slide 2" loading="lazy" />
                <div className="text-center category-title">Shoes</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/clothing">
                <Image src="/img/clothing.webp" height={175} width={175} alt="Slide 3" loading="lazy" />
                <div className="text-center category-title">Clothing</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">              
              <Link href="/boots">
                <Image src="/img/BootsIcon.webp" height={175} width={175} alt="Slide 4" loading="lazy" />
                <div className="text-center category-title">Boots</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>    
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/bags">
                <Image src="/img/BagTopIcon_19Sep.webp" height={175} width={175} alt="Slide 5" loading="lazy" />
                <div className="text-center category-title">Bags</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/boutique">
                <Image src="/img/sss-boutique.webp" height={175} width={175} alt="Slide 6" loading="lazy" />
                <div className="text-center category-title">Boutique</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/hot-trending">
                <Image src="/img/hotandTrending.webp" height={175} width={175} alt="Slide 7" loading="lazy" />
                <div className="text-center category-title">Hot & Trending</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/influencer-program">
                <Image src="/img/sss_influencer_program.webp" height={175} width={175} alt="Slide 8" loading="lazy" />
                <div className="text-center category-title">Influencer Program</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/grab-and-go">
                <Image src="/img/GrabandGoIcon_10Mar.webp" height={175} width={175} alt="Slide 9" loading="lazy" />
                <div className="text-center category-title">Grab and Go</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/accessories">
                <Image src="/img/accessery.webp" height={175} width={175} alt="Slide 10" loading="lazy" />
                <div className="text-center category-title">Accessories</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/shop-the-reel">
                <Image src="/img/shop_the_reel.webp" height={175} width={175} alt="Slide 11" loading="lazy" />
                <div className="text-center category-title">Shop the Reel</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>
            <SwiperSlide className="text-center">
              <Link href="/mens">
                <Image src="/img/men_shirt_3_for_899_icon_2.webp" height={175} width={175} alt="Slide 12" loading="lazy" />
                <div className="text-center category-title">Mens</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>  
            <SwiperSlide className="text-center">
              <Link href="/descover">
                <Image src="/img/discover.webp" height={175} width={175} alt="Slide 13" loading="lazy" />
                <div className="text-center category-title">Discover</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide> 
            <SwiperSlide className="text-center">
              <Link href="/upcoming-drops">
                <Image src="/img/upcoming_drops.webp" height={175} width={175} alt="Slide 14" loading="lazy" />
                <div className="text-center category-title">Upcoming Drops</div>
                <div className="text-center category-subtitle">0 items</div>
              </Link>  
            </SwiperSlide>  */}
          </Swiper>
        </div>
      </div>
    </section>
  );
};