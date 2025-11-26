'use client';
import Image from "next/image";
import { CurrentlyLovingProps } from '../../types';
import Link from "next/link";
export const CurrentlyLoving = ({ title, subtitle, items }: CurrentlyLovingProps) => {
  return (
    <section className="section">
      <div className="mx-auto w-100">
        <div className="container">
          <div className="mx-2 mb-2 mt-1 text-lg font-semibold text-gray-600 items-center">
            <div className="items-center gap-2">
              <div className="text-center">
                <h2 className="text-lg font-bold text-color mb-0 heading-upper">
                    {title}
                </h2>
                <div className="mt-1 text-sm text-gray-400">
                    {subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container flex-grow w-100 py-2 mx-auto px-0 bg-gray-100">
          <div className="mx-auto w-100">
            <div className="container">
              <div id="scrollContainer" className="d-flex flex-no-wrap overflow-x-scroll scrolling-touch tems-start">
                {items.map((item, index) => (
                    <div key={index} className="w-36 mr-2 relative">
                        <Link href={item.url} target="_blank" aria-label="Visit our Stars">
                            <Image width={40} height={40} src={item.image} alt="How people are wearing our products." loading="lazy" data-src={item.image} className="w-100"/>
                        </Link>
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