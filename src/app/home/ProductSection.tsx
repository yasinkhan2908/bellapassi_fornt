'use client';
import Image from "next/image";
import { ProductSectionProps } from '../../types';
import Link from "next/link";
export const ProductSection = ({ products }: ProductSectionProps) => {
  return (
    <section className="section">
      <div className="mx-auto w-100">
        <div className="container">
          <div className="mx-2 mb-2 mt-1 text-lg font-semibold text-gray-600 d-flex justify-between items-center">
            <div className="d-flex items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-color mb-0">
                    Upcoming Drops
                </h2>
                <div className="mt-1 text-sm text-gray-400">
                    Help Us to come up with new collection.
                </div>
              </div>
            </div>
            <Link href="#" className="">
              <div className="text-gray-600 d-flex items-center gap-0.5">
                <div className="text-xs font-semibold mr-1 underline underline-offset-4 whitespace-nowrap">View All</div>
                <div className="text-sm">
                  <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              </Link>
          </div>
        </div>

        <div className="container flex-grow w-100 py-2 mx-auto px-0 bg-gray-100">
          <div className="mx-auto w-100">
            <div className="container">
              <div id="scrollContainer" className="d-flex flex-no-wrap overflow-x-scroll scrolling-touch tems-start shadow hover:text-blackshadow-lg">
                {products.map((item, index) => (
                  <div key={index} className="relative">
                    <div id="product-block-128805" className="w-100 d-flex justify-center mr-2">
                      <div className="w-28 w-52">
                        <div className="cursor-pointer group">
                          <div className="overflow-hidden relative ripple">
                            <Link href="#" data-track="#" data-track-position="upcoming-drop-menu" data-page="Home" data-link-position="1" no-prefetch="">
                              <Image width={40} height={40} src={item.image} alt="" loading="lazy" className="lazy-img-fadein w-100" />
                            </Link>
                            <div className="opacity-90 bg-white d-flex justify-center items-center absolute top-0 left-0 shadow p-0.5 text-xs font-semibold rounded-sm drop-shadow-2xl shadow-sss-primary-500/50">
                              {/* <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" fill="none"><path fill="#EB9E24" d="m2.667 12 .666-4.667H1c-.167 0-.27-.044-.309-.133-.038-.089-.013-.211.076-.367L4.667 0h.666l-.666 4.667H7c.167 0 .27.044.308.133.04.089.014.211-.075.367L3.333 12h-.666Z"></path></svg>
                              </div> */}
                              <div className="text-[0.85em] fonts-semibold text-gray-800 mx-1"> -{item.discount_price}%</div>
                            </div>
                            <div className="px-2 opacity-90 bg-white d-flex justify-start absolute bottom-1.5 left-1 shadow p-0.5 text-xs font-semibold rounded-lg drop-shadow-2xl shadow-sss-primary-500/50">
                              <div className="d-flex">
                                <div>{item.rating}</div>
                                <div className="home-star">
                                  <i className="bi bi-star"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-2 py-2 bg-white relative">
                            <Link href="#" no-prefetch="">
                              <h1 className="text-gray-700 text-sm sm:text-sm hover:text-blacktext-red-500 transition duration-300 ease-in-out h-auto w-100 mr-2 font-semibold truncate mb-0">
                                <span>{item.name}</span>
                              </h1>
                            </Link>
                            {/* <div className="opacity-75 d-flex justify-end absolute top-0 right-0 p-0.5 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current "><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div> */}
                            <Link href="#" no-prefetch="">
                              <div className="d-flex py-1">
                                <p className="mr-2 -900 font-semibold text-sm">₹ {item.price}</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};