'use client';
import Image from "next/image";
import { ShopGramProps, ShopGramItem } from '../../types';

// Type guard to check if object has image_video property
const hasImageVideo = (item: any): item is { image_video: string } => {
    return 'image_video' in item && typeof item.image_video === 'string';
};

export const ShopGram = ({ shopgrams }: ShopGramProps) => {
    
    if (!shopgrams || shopgrams.length === 0) {
        return null; // or a loading/empty state
    }
    
  return ( 
    <section className="section mt-4" data-aos="fade-up">
        <div className="container">
            <div className="shop-gram-heding">
                <h4 className="text-center m-0 p-0">Shop Gram</h4>
                <p className="text-center mt-2 p-0">Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
            </div>
            <div className="shop-gram-products">
                <div className="row">
                    {shopgrams.map((shopgram) => {
                        // Type-safe way to get image source
                        let imageSrc = '';
                        
                        // Check what type of shopgram we have
                        if (hasImageVideo(shopgram)) {
                            imageSrc = shopgram.image_video;
                        } else if ('imageUrl' in shopgram && shopgram.imageUrl) {
                            imageSrc = shopgram.imageUrl;
                        } else if ('image' in shopgram && shopgram.image) {
                            imageSrc = shopgram.image;
                        }
                        
                        // If it's a video type (if you have that property)
                        if (shopgram.type === 'video') {
                            return (
                                <div key={shopgram.id} className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                                    <div className="w-100 shop-gram-sec">
                                        <div className="shop-gram">
                                            {/* Handle video display */}
                                            <video 
                                                autoPlay 
                                                loop 
                                                muted 
                                                playsInline 
                                                className="w-100 shopy-video"
                                                style={{ height: 294 }}
                                                preload="metadata"
                                            >
                                                <source 
                                                    src={imageSrc} 
                                                    type="video/mp4" 
                                                />
                                            </video>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        
                        // Image display
                        return (
                            <div key={shopgram.id} className="col-lg-2 col-sm-6 d-flex flex-column align-items-center justify-content-center shop-gram-item my-3">
                                <div className="w-100 shop-gram-sec">
                                    <div className="shop-gram">
                                        {imageSrc ? (
                                            <Image 
                                                width={196} 
                                                height={294}  
                                                src={imageSrc} 
                                                alt='Shopgram image' 
                                                className="w-100" 
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-100 h-100 bg-gray-200 d-flex align-items-center justify-content-center">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
  );
};