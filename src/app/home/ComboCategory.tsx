'use client';
import Image from "next/image";
import { ComboCategoryProps } from '../../types';
import Link from "next/link";

export const ComboCategory = ({}: ComboCategoryProps) => {
  return (
    <section className="combo-section" data-aos="fade-up">
        <div className="row">
            <div className="col-md-6">
                <div className="left-compo relative overflow-hidden">
                    <Image
                        src="/img/category-1.jpg.webp"
                        alt="Womens fashion"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover -z-10"
                        priority
                    />
                    <div className="relative z-10">
                        <h3 className="text-4xl p-10">Womens fashion</h3>
                        <p>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore.</p>
                        <Link href='/women-fashion' prefetch={false}>Show Now</Link>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions relative overflow-hidden">
                                <Image
                                    src="/img/category-2.jpg.webp"
                                    alt="Mens fashion"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover -z-10"
                                />
                                <div className="relative z-10">
                                    <h3 className="text-4xl p-10 mb-0">Mens fashion</h3>
                                    <p className="mb-2">348 items</p>
                                    <Link href="/mens-fashion" prefetch={false}>Show Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions relative overflow-hidden">
                                <Image
                                    src="/img/category-3.jpg.webp"
                                    alt="Kid's fashion"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover -z-10"
                                />
                                <div className="relative z-10">
                                    <h3 className="text-4xl p-10 mb-0">Kid's fashion</h3>
                                    <p className="mb-2">348 items</p>
                                    <Link href="/kids-fashion" prefetch={false}>Show Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions relative overflow-hidden">
                                <Image
                                    src="/img/category-4.jpg.webp"
                                    alt="Cosmetics"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover -z-10"
                                />
                                <div className="relative z-10">
                                    <h3 className="text-4xl p-10 mb-0">Cosmetics</h3>
                                    <p className="mb-2">348 items</p>
                                    <Link href="/cosmetics" prefetch={false}>Show Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions relative overflow-hidden">
                                <Image
                                    src="/img/category-5.jpg.webp"
                                    alt="Accessories"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover -z-10"
                                />
                                <div className="relative z-10">
                                    <h3 className="text-4xl p-10 mb-0">Accessories</h3>
                                    <p className="mb-2">348 items</p>
                                    <Link href="/accessories" prefetch={false}>Show Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};