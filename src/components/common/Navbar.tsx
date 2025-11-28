'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';

import { useAppSelector } from "@/lib/hooks";
import { selectCartCount } from "@/lib/slices/cartSlice";

export default function Navbar() {
    const session = useSession();
    const token = session?.data?.user.token ?? null;
    const [cartCount, setCartCount] = useState(0);
    //console.log("header token : ",token);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    interface MainCategory {
        id: number;
        name: string
        // add other fields if needed
    }
    type Category = {
        id: number;
        name: string;
        seo: string;
        image: string;
    };
    const [maincategorys, setMainCategory] = useState<MainCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    

     useEffect(() => {
        // Get cart count
        if (typeof window !== "undefined") {
            const cartItems = localStorage.getItem("cart_items");
            setCartCount(cartItems ? JSON.parse(cartItems).length : 0);
        }
        const fetchProfile = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/main-category`, {
                            cache: 'no-store', // ensures fresh data each time
                        });
            const responseData = await res.json();
            const data = responseData.data;
            //console.log("main category",data);
            setMainCategory(data.main_category);
              // ✅ Automatically click the first category after loading
            if (data.main_category.length > 0) {
                handleClick(data.main_category[0].id);
            }
          } catch (err) {
              console.error('Error fetching profile:', err);
          }
      };
      fetchProfile();
    }, []);

    const handleClick = async (parentId: number) => {
        //console.log(parentId); 

         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get-child-category/${parentId}`, {
                            cache: 'no-store', // ensures fresh data each time
                        });
        const responseData = await res.json();
        const data = responseData.data;
        //console.log('child category',data);
        //console.log(data.data.main_category);
        //setMainCategory(data.main_category);
        //console.log(data.data.categories);
        setSelectedCategory(data.categories);
    };

    const closeSidebar = () => {
        const sidebar = document.getElementsByClassName("leftsidebar");
        if (!sidebar)
        {
            return;
        }
        const offcanvas = (window as any).bootstrap?.Offcanvas.getInstance(sidebar);
        offcanvas?.hide();
    };

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
                                {maincategorys.map((category, index) => (
                                    <li key={index} onClick={() => handleClick(category.id)}  className="nav-item" role="presentation">
                                        <span className={`nav-link ${ activeCategoryId === category.id ? "active" : "" }`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" role="tab" aria-controls="home" aria-selected="true">
                                            {category.name}
                                        </span>
                                    </li>
                                ))}
                                {/* <li className="nav-item" role="presentation">
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
                                </li> */}
                            </ul>
                        </div>

                        <div className="tab-content p-0 border border-top-0 left-sidebar-category-list" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                {selectedCategory.length > 0 ? (
                                    selectedCategory.map((category, index) => (
                                        <div key={category.id} className="d-flex items-center cat-lst p-1">
                                            <span className="p-2 pl-4 font-semibold text-sm w-100">
                                                <Link href={`/${category.seo}`} className="" onClick={closeSidebar}>
                                                    <div className="d-flex">
                                                        <div className="w-10 relative">
                                                            <Image
                                                                width={48}
                                                                height={48}
                                                                alt="Profile picture"
                                                                src={category.image}
                                                                loading="lazy"
                                                                className="img-fluid rounded-full"
                                                            />
                                                        </div>

                                                        <div className="align-middle catname px-3 pt-2.5">
                                                            {category.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="d-flex items-center cat-lst p-1">
                                        <span className="p-2 pl-4 font-semibold text-sm w-100">                                            
                                            <div className="d-flex">                                                    
                                                <div className="align-middle catname px-3 pt-2.5">
                                                    No categories found
                                                </div>
                                            </div>                                            
                                        </span>
                                    </div>
                                )}

                                

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
                                        <Link href="/user/dashboard" className=""> My Account</Link>
                                    </div>
                                </div>
                            </div> 
                        )}
                            
                        

                        <div className="p-4 page-link bg-white">
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    {token? (
                                        <Link href="/user/dashboard" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-house-door"></i>
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-house-door"></i>
                                        </Link>
                                    )}
                                </div>
                                {token? (
                                    <Link href="/user/dashboard">
                                        <p className="font-semibold px-2 text-sm  p-0 m-0">My Account</p>
                                    </Link>
                                ) : (
                                    <Link href="/login">
                                        <p className="font-semibold px-2 text-sm  p-0 m-0">My Account</p>
                                    </Link>
                                )}
                            </div>
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    {token? (
                                        <Link href="/user/dashboard" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-cart"></i>
                                        </Link>
                                    ) : (
                                        <Link href="/login" className="inline-block no-underline hover:text-black">
                                            <i className="bi bi-cart"></i>
                                        </Link>
                                    )}
                                    
                                
                                    
                                </div>

                                {token? (
                                    <Link href="/user/dashboard">
                                        <p className="font-semibold px-2 text-sm  p-0 m-0">My Orders</p>
                                    </Link>
                                ) : (
                                    <Link href="/login">
                                        <p className="font-semibold px-2 text-sm  p-0 m-0">My Orders</p>
                                    </Link>
                                )}
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-envelope"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm  p-0 m-0">My Support</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-award"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm  p-0 m-0">My Coupon</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-fire"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm  p-0 m-0">My Refunds</p>
                                </Link>
                            </div>
                            
                            <div className="d-flex flex-row py-2.5">
                                <div>
                                    <Link href="#" className="inline-block no-underline hover:text-black">
                                    <i className="bi bi-credit-card"></i>
                                    </Link>
                                </div>
                                <Link href="#" className="">
                                    <p className="font-semibold px-2 text-sm  p-0 m-0">Contact Details</p>
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
                                <span className="badge">{cartCount ?? 0}</span>
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
