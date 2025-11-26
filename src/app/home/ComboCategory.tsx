'use client';
import Image from "next/image";
import { ComboCategoryProps } from '../../types';
import Link from "next/link";

export const ComboCategory = ({}: ComboCategoryProps) => {
  return (
    <section className="combo-section" data-aos="fade-up" >
        <div className="row">
            <div className="col-md-6">
                <div className="left-compo" style={{ backgroundImage: "url('/img/category-1.jpg.webp')" }}>
                    <h3 className="text-4xl p-10">Womens fashion</h3>
                    <p>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore.</p>
                    <Link href='/women-fashion'>Show Now</Link>
                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions" style={{ backgroundImage: "url('/img/category-2.jpg.webp')" }}>
                                <h3 className="text-4xl p-10 mb-0">Mens fashion</h3>
                                <p className=" mb-2">348 items</p>
                                <Link href="/mens-fashion">Show Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions" style={{ backgroundImage: "url('/img/category-3.jpg.webp')" }}>
                                <h3 className="text-4xl p-10 mb-0">Kid’s fashion</h3>
                                <p className=" mb-2">348 items</p>
                                <Link href="/kids-fashion">Show Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions" style={{ backgroundImage: "url('/img/category-4.jpg.webp')" }}>
                                <h3 className="text-4xl p-10 mb-0">Cosmetics</h3>
                                <p className=" mb-2">348 items</p>
                                <Link href="/cosmetics">Show Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-compo">
                            <div className="fashions" style={{ backgroundImage: "url('/img/category-5.jpg.webp')" }}>
                                <h3 className="text-4xl p-10 mb-0">Accessories</h3>
                                <p className=" mb-2">348 items</p>
                                <Link href="/accessories">Show Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};