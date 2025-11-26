'use client';
import Image from "next/image";
import { ShopGramProps } from '../../types';

export const ShopGram = ({ products }: ShopGramProps) => {
  return (
    <section className="section mt-4" data-aos="fade-up">
        <div className="container">
            <div className="shop-gram-heding">
                <h4 className="text-center m-0 p-0">Shop Gram</h4>
                <p className="text-center mt-2 p-0">Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
            </div>
            <div className="shop-gram-products">
                <div className="row">
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294}  src="/img/308434-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294} src="/img/310829-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                            </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294} src="/img/271014-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294} src="/img/274576-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294} src="/img/308750-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                        <div className="w-100 shop-gram-sec">
                            <div className="shop-gram">
                                <Image width={196} height={294} src="/img/246752-sss_vertical.webp" alt="" className="w-100" loading="lazy"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </section>
    
  );
};