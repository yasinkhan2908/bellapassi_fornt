'use client';
import Image from "next/image";
import Link from "next/link";
import { AboutStoreProps } from '../../types';

export const AboutStore = ({}: AboutStoreProps) => {
  return (
    <section className="section" data-aos="fade-up">
      <div className="mx-auto w-100">
        <div className="container">
          <div className="mx-2 mb-2 mt-1 text-lg font-semibold text-gray-600 items-center">
            <div className="items-center gap-2">
              <div className="text-center">
                <h2 className="text-lg font-bold text-color mb-0 heading-upper  mb-3">
                    Bella Passi
                </h2>
              </div>
            </div>


            
            <div className="accordion" id="accordionExample">
              <div className="accordion-item mb-2">
                <h2 className="accordion-header bg-gray-100" id="headingOne">
                  <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                    <strong>Help</strong>
                  </span>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="accordion-body home-accordion-body">
                    <div className="d-flex flex-col">
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          Returns &amp; Exchange
                        </Link>
                      </div>
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          Shipping Policy
                        </Link>
                      </div>
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          FAQ
                        </Link>
                      </div>
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          Terms &amp; Conditions
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item mb-2">
                <h2 className="accordion-header bg-gray-100" id="headingTwo">
                  <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-controls="collapseTwo">
                    <strong>About Bella Passi</strong>
                  </span>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="accordion-body home-accordion-body">
                    <div className="d-flex flex-col">
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          About US
                        </Link>
                      </div>
                      <div className="p-2 text-sm">
                        <Link href="#" className="">
                          Privacy Policy
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item mb-2">
                <h2 className="accordion-header bg-gray-100" id="headingThree">
                  <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-controls="collapseThree">
                    <strong>Connect</strong>
                  </span>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="accordion-body home-accordion-body">
                    <div className="grid-1 grid grid-cols-2 mt-4 gap-8 lg-grid-cols-3">
                      <div className="col-span-2 md-col-span-1">
                        <p className="mb-4 d-flex justify-start md-justify-start align-top connect-data">
                          <i className="bi bi-house-door mr-2"></i>
                          Office No.706, Pearl Business Park, Netaji Subhash Place, Pitampura, North West Delhi, Delhi-110034
                        </p>
                        <p className="mb-4 d-flex items-center justify-start md-justify-start connect-data">
                          <i className="bi bi-phone mr-2"></i>
                            +91-11-41171712  (10 AM - 6 PM, Mon to Sat)
                        </p>
                        <div className="d-flex p-4 justify-around bg-white">
                          <div className="w-8">
                            <Link href="#" target="_blank" aria-label="Follow Bella Passi on Facebook">
                              <Image width={40} height={40} src="/img/v1/social/fb.png" alt="Follow Bella Passi on Facebook" loading="lazy"/>
                            </Link>
                          </div>
                          <div className="w-8">
                            <Link href="#" target="_blank" aria-label="Follow Bella Passi on Instagram">
                              <Image width={40} height={40} src="/img/v1/social/instagram.jpeg" alt="Follow Bella Passi on Instagram" loading="lazy"/>
                            </Link>
                          </div>
                          <div className="w-8">
                            <Link href="#" target="_blank" aria-label="Join Bella Passi to get offers">
                              <Image width={40} height={40} src="/img/v1/social/telegram-512.webp" alt="Join Bella Passi to get offers" loading="lazy"/>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
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