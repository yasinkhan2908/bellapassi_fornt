import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navbar() {
    const session = await getServerSession(authOptions);
    console.log("session : ",session?.user.token);
    const token = session?.user.token;
    console.log("nav token : ",token);
  return (
    <header  id="header" className="header sticky-top">
        
        <div className="main-header">
            <div className="container-fluid container-xl">
                <div className="d-flex py-1 align-items-center justify-content-between">
                    <Link href="#" className="logo d-flex align-items-center left-list-icon"  data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar">
                        <i className="bi bi-list"></i>
                    </Link>
                    <div className="offcanvas offcanvas-start leftsidebar " id="sidebar" aria-labelledby="sidebarLabel">
                        <div className="left-sidebar-category">
                            <ul className="nav nav-tabs " id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <span className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" role="tab" aria-controls="profile" aria-selected="false">
                                        Curated Wardrobe Deals
                                    </span>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <span className="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings"  role="tab" aria-controls="settings" aria-selected="false">
                                        Clothing Trending
                                    </span>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <span className="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" role="tab" aria-controls="settings" aria-selected="false">
                                        Curated Shoes Deals
                                    </span>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <span className="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" role="tab" aria-controls="settings" aria-selected="false">
                                        Beauty & Accessories
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="tab-content p-0 border border-top-0 left-sidebar-category-list" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/shoes" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/shoes.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Shoes
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/clothing" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/clothing.webp" alt="Clothing" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Clothing
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/boots" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/BootsIcon.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Boots
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/bags" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/BagTopIcon_19Sep.jpg" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Bags
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/boutique" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/sss-boutique.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Boutique
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/hot-and-trending" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/hotandTrending.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Hot & Trending
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/influencer-program" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/sss_influencer_program.jpeg" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Influencer Program
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/grab-and-go" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/GrabandGoIcon_10Mar.jpg" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Grab and Go
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/accessories" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/accessery.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Accessories
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/shop-the-reel" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/shop_the_reel.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Shop the Reel
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/mens" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/men_shirt_3_for_899_icon_2.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Mens
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/discover" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/discover.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Discover
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>
                                
                                <div className="d-flex items-center cat-lst p-1">
                                    <span className="p-2 pl-4 font-semibold text-sm w-100">
                                        <Link href="/upcoming-drops" className="">
                                            <div className="d-flex">
                                                <div className="w-10 relative">
                                                    <div>
                                                        <Image width={48} height={48} src="/img/upcoming_drops.webp" alt="New Arrival" loading="lazy" className="img-fluid rounded-full"/>
                                                    </div>
                                                </div>
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    Upcoming Drops
                                                </div>
                                            </div>
                                        </Link>
                                    </span>
                                </div>

                            </div>
                        </div>
                        
                        <div className="h-6 bg-gray-100"></div>
                        <div className="d-flex p-4 justify-around bg-white">
                            <div className="w-8">
                                <Link href="#" target="_blank" aria-label="Follow on Facebook">
                                    <Image width={32} height={32} src="/img/fb.png" className="img-fluid" alt="Follow Bella Passi on Facebook" loading="lazy"/>
                                </Link>
                            </div>
                            <div className="w-8">
                                <Link href="#" target="_blank" aria-label="Follow on Instagram">
                                    <Image width={32} height={32} src="/img/instagram.jpeg" className="img-fluid" alt="Follow Bella Passi on Instagram" loading="lazy"/>
                                </Link>
                            </div>
                            <div className="w-8">
                                <Link href="#" target="_blank" aria-label="Join Bella Passi to get offers">
                                    <Image width={32} height={32} src="/img/telegram-512.webp" alt="" className="img-fluid"  aria-label="Join to get offers" loading="lazy"/>
                                </Link>
                            </div>
                        </div>
                        
                        {!token ? (
                            <div className="h-6 bg-gray-100 leftside-sigh">
                                <div className="d-flex justify-around text-sss-primary-500">
                                    <div className="underline-offset-4">
                                        <Link href="/login" className=""> Sign In</Link>
                                    </div>
                                    <div className="underline-offset-4">
                                        <Link href="/login" className=""> Login</Link>
                                    </div>
                                </div>
                            </div> 
                        ) : (                                    
                        <div className="h-6 bg-gray-100 leftside-sigh">
                            <div className="d-flex justify-around text-sss-primary-500">
                                <div className="underline-offset-4">
                                    <Link href="/user/account-setting" className=""> My Account</Link>
                                </div>
                            </div>
                        </div> 
                    )}
                            
                        

                        <div className="p-4 page-link bg-white">
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    {token? (
                                        <Link href="/user/dashboard" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-house-door"></i> My Account
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-house-door"></i> My Account
                                        </Link>
                                    )}
                                </div>
                                
                            </div>
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    
                                    <Link href="/user/dashboard" className="inline-block no-underline hover:text-black">
                                        <i className="bi bi-cart"></i>
                                    </Link>
                                
                                    
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm">My Orders</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-envelope"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm">My Support</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-award"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm">My Coupon</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-fire"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm">My Refunds</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-credit-card"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm">Contact Details</p>
                                </Link>
                            </div>
                        </div>

                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header bg-gray-100" id="headingSideOne">
                                    <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-controls="collapseOne">
                                    Help & Information
                                    </span>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingSideOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
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

                            <div className="accordion-item">
                                <h2 className="accordion-header bg-gray-100" id="headingSideTwo">
                                    <span className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-controls="collapseTwo">
                                        About
                                    </span>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingSideTwo" data-bs-parent="#accordionExample">
                                    <div className="accordion-body">
                                        <div className="d-flex flex-col">
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="">
                                                    About US
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="">
                                                    Our Stores
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
                        </div>
                    </div>
                        <Link href="/" className="logo d-flex align-items-center">
                            <Image src="/img/logo7.webp" width={195} height={25} alt="logo" loading="lazy" unoptimized/>
                        </Link>

                        <form className="search-form desktop-search-form">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search for products"/>

                            </div>
                        </form>

                        <div className="header-actions d-flex align-items-center justify-content-end">

                            <button className="header-action-btn mobile-search-toggle d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#mobileSearch" aria-controls="mobileSearch" role="button" aria-label="search">
                                <i className="bi bi-search"></i>
                            </button>

                            {/* <Link href="" className="header-action-btn">
                                <i className="bi bi-house-door"></i>
                            </Link> */}
                            {token? (
                                <Link href="/user/dashboard" className="header-action-btn">
                                    <i className="bi bi-person"></i>
                                </Link>
                            ) : (
                                <Link href="/login" className="header-action-btn">
                                    <i className="bi bi-person"></i>
                                </Link>
                            )}
                                    
                                

                            <Link href="/contact" className="header-action-btn d-none d-md-block">
                                <i className="bi bi-heart"></i>
                                <span className="badge">0</span>
                            </Link>

                            <Link href="/cart" className="header-action-btn">
                                <i className="bi bi-cart3"></i>
                                <span className="badge">3</span>
                            </Link>

                            

                        </div>
                    </div>
                </div>
            </div>
            <div className="collapse" id="mobileSearch">
            <div className="container">
                <form className="search-form">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for products"/>
                        <button className="btn" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </header>
  );
}
