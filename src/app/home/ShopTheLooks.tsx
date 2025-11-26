'use client';
import { ShopTheLooksProps } from '../../types';
import Link from "next/link";
export const ShopTheLooks = ({ items }: ShopTheLooksProps) => {
  return (
    <section className="section" data-aos="fade-up">
      <div className="mx-auto w-100">
        <div className="container"> 
          <h4 className="text-center heading-shop mb-3">Shop the Look</h4>
          <div id="scrollContainer" className="d-flex flex-no-wrap overflow-x-scroll scrolling-touch tems-start ml-1 no-scrollbar">
            {items.map((item, index) => (
              <div  key={index} className="relative mr-1">
                <div>
                  <div className="relative mb-1 rounded-lg w-40 w-60 w-40">
                    <Link href={item.url} className="" data-track="#" data-track-position="look-menu" data-page="Home" data-link-position="1">
                      <video  autoPlay 
                          loop 
                          muted 
                          playsInline  className="shopy-video" >
                        <source data-src={item.video} src={item.video} type="video/mp4"/>
                      </video>
                    </Link>
                    <Link href={item.url} className="" data-track="#" data-track-position="look-menu" data-page="Home" data-link-position="1">
                      <div className="justify-center bottom-0 absolute w-100 h-36">
                        <div className="justify-center top-20 absolute w-100 h-12 text-center w-100 pointer">
                          <span className="transition duration-500 ease-in-out text-white font-bold py-1 px-3 inline-flex justify-center border border-white text-sm rounded-lg bg-opacity-40 text-opacity-100">
                            <span>Shop Now</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}