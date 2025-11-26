'use client';
import Image from "next/image";
import { DeliveryOptionProps } from '../../types';

export const DeliveryOption = ({}: DeliveryOptionProps) => {
  return (
    <div className="container mt-4 mb-4" data-aos="fade-up">
        <div className="row">
            <div className="col-md-3">
                <div className="row0">
                    <div className="free-delivery text-center">
                        <div className="delivery-img">
                            <Image src="/img/1b.png" height={32} width={30} alt="free delivery" loading="lazy"/>
                        </div>
                        <div className="service-title">FAST DELIVERY</div>
                        <div className="service-desc">Free For All Type order</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="row0">
                    <div className="free-delivery text-center">
                        <div className="delivery-img">
                            <Image src="/img/2b.png" height={32} width={30} alt="free delivery" loading="lazy"/>
                        </div>
                        <div className="service-title">FREE SUPPORT</div>
                        <div className="service-desc">Best Prices Best Product</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="row0">
                    <div className="free-delivery text-center">
                        <div className="delivery-img">
                            <Image src="/img/3b.png" height={32} width={30} alt="free delivery" loading="lazy"/>
                        </div>
                        <div className="service-title">EXCHANGE OFFER</div>
                        <div className="service-desc">One day To Chang Product</div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="row0">
                    <div className="free-delivery text-center">
                        <div className="delivery-img">
                            <Image src="/img/4b.png" height={32} width={30} alt="free delivery" loading="lazy"/>
                        </div>
                        <div className="service-title">MONEY BACK</div>
                        <div className="service-desc">Support System 24/7</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};