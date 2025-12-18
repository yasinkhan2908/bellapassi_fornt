'use client';
import Image from "next/image";
import { ComboCategoryProps } from '../../types';
import Link from "next/link";

export const ComboCategory = ({categories}: ComboCategoryProps) => {
  return (
    <section className="combo-section" data-aos="fade-up">
      {categories.length > 0 && (
        <div className="row">
          {/* LEFT BIG CATEGORY */}
          {categories[0] && (
            <div className="col-md-6">
              <div className="left-compo relative overflow-hidden">
                <Image
                  src={categories[0].image}
                  alt={categories[0].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover -z-10"
                  priority
                />
                <div className="relative z-10">
                  <h3 className="text-4xl p-10">{categories[0].name}</h3>
                  <p>
                    {categories[0].description}
                  </p>
                  <Link href={categories[0].seo} prefetch={false}>
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT GRID CATEGORIES */}
          <div className="col-md-6">
            <div className="row">
              {categories.slice(1).map((category) => (
                <div className="col-md-6" key={category.id}>
                  <div className="right-compo">
                    <div className="fashions relative overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover -z-10"
                      />
                      <div className="relative z-10">
                        <h3 className="text-4xl p-10 mb-0">
                          {category.name}
                        </h3>
                        <Link className="mt-3" href={category.seo} prefetch={false}>
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};