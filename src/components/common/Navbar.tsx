'use client';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart 
} from '../../lib/slices/cartSlice';
import { getSessionId } from '@/lib/session';

export default function Navbar() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const session = useSession();
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    interface MainCategory {
        id: number;
        name: string;
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
    const { items, total, loading, error } = useAppSelector(state => state.cart);
    const cartCount = items.length;
    const sessionId = getSessionId();
    
    const sidebarRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    
    var token = '';
    if (session?.data?.user?.token) {
        token = session?.data?.user?.token;
    }
    
    // Load cart data
    useEffect(() => {
        const loadCartData = async () => {
            try {
                const result = await dispatch(
                    fetchCart({
                        session_id: sessionId,
                        token: token,
                    })
                ).unwrap();
                console.log('Cart loaded successfully:', result);
            } catch (err) {
                console.error('Failed to load cart:', err);
            }
        };
        loadCartData();
    }, [dispatch, sessionId, token]);
    
    // Load main categories
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/main-category`, {
                    cache: 'no-store',
                });
                const responseData = await res.json();
                const data = responseData.data;
                setMainCategory(data.main_category);
                
                if (data.main_category.length > 0) {
                    handleClick(data.main_category[0].id);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);
    
    // Handle click outside to close sidebar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current && 
                !sidebarRef.current.contains(event.target as Node) &&
                backdropRef.current &&
                backdropRef.current.contains(event.target as Node)
            ) {
                closeSidebar();
            }
        };
        
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showSidebar) {
                closeSidebar();
            }
        };
        
        if (showSidebar) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'auto';
        };
    }, [showSidebar]);
    
    const handleClick = async (parentId: number) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get-child-category/${parentId}`, {
            cache: 'no-store',
        });
        const responseData = await res.json();
        const data = responseData.data;
        setSelectedCategory(data.categories);
        setActiveCategoryId(parentId);
    };
    
    const openSidebar = () => {
        setShowSidebar(true);
        setIsClosing(false);
    };
    
    const closeSidebar = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowSidebar(false);
            setIsClosing(false);
        }, 300); // Match transition duration
    };
    
    // Toggle accordion manually
    const toggleAccordion = (id: string) => {
        const accordionItem = document.getElementById(id);
        if (accordionItem) {
            const isExpanded = accordionItem.getAttribute('aria-expanded') === 'true';
            accordionItem.setAttribute('aria-expanded', (!isExpanded).toString());
            
            const content = document.querySelector(`[aria-labelledby="${id}"]`);
            if (content) {
                if (isExpanded) {
                    content.classList.remove('show');
                } else {
                    content.classList.add('show');
                }
            }
        }
    };


    const handleFocus = () => {
        router.push('/search'); // Redirect to your search page
    };
 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setSearchQuery(value);
        console.log('Current value:', value);
        // You can perform other actions here
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    };
    

    return (
        <header id="header" className="header sticky-top">
            <div className="main-header"> 
                <div className="container-fluid container-xl">
                    <div className="d-flex py-1 align-items-center justify-content-between">
                        {/* Sidebar Toggle Button */}
                        <Link href="#"  
                            className="logo d-flex align-items-center left-list-icon" 
                            onClick={openSidebar}
                            aria-label="Open menu"
                        >
                            <i className="bi bi-list"></i>
                        </Link>
                        
                        {/* Custom Sidebar Backdrop */}
                        {showSidebar && (
                            <div 
                                ref={backdropRef}
                                className={`custom-backdrop ${isClosing ? 'fade-out' : 'fade-in'}`}
                                onClick={closeSidebar}
                                aria-hidden="true"
                            ></div>
                        )}
                        
                        {/* Custom Sidebar */}
                        <div ref={sidebarRef} className={`custom-sidebar ${showSidebar ? 'show' : ''} ${isClosing ? 'closing' : ''}`} id="sidebar" aria-labelledby="sidebarLabel">
                            
                            <div className="left-sidebar-category">
                                <ul className="nav nav-tabs " id="myTab" role="tablist">
                                    {maincategorys.map((category, index) => (
                                        <li key={index} onClick={() => handleClick(category.id)}  className="nav-item" role="presentation">
                                            <span className={`nav-link ${ activeCategoryId === category.id ? "active" : "" }`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home" role="tab" aria-controls="home" aria-selected="true">
                                                {category.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="tab-content p-0 border border-top-0 left-sidebar-category-list">
                                <div className="tab-pane active" role="tabpanel">
                                    {selectedCategory.length > 0 ? (
                                        selectedCategory.map((category, index) => (
                                            <div key={category.id} className="d-flex items-center cat-lst p-1">
                                                <span className="p-2 pl-4 font-semibold text-sm w-100">
                                                    <Link 
                                                        href={`/${category.seo}`} 
                                                        className="" 
                                                        onClick={closeSidebar}
                                                        prefetch={false}
                                                    >
                                                        <div className="d-flex">
                                                            <div className="w-10 relative">
                                                                <Image
                                                                    width={48}
                                                                    height={48}
                                                                    alt={category.name}
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
                                    <Link 
                                        href="#" 
                                        onClick={closeSidebar} 
                                        target="_blank" 
                                        aria-label="Follow on Facebook"
                                        prefetch={false}
                                    >
                                        <Image 
                                            width={32} 
                                            height={32} 
                                            src="/img/fb.png" 
                                            className="img-fluid" 
                                            alt="Follow Bella Passi on Facebook" 
                                            loading="lazy"
                                        />
                                    </Link>
                                </div>
                                <div className="w-8">
                                    <Link 
                                        href="#" 
                                        onClick={closeSidebar} 
                                        target="_blank" 
                                        aria-label="Follow on Instagram"
                                        prefetch={false}
                                    >
                                        <Image 
                                            width={32} 
                                            height={32} 
                                            src="/img/instagram.jpeg" 
                                            className="img-fluid" 
                                            alt="Follow Bella Passi on Instagram" 
                                            loading="lazy"
                                        />
                                    </Link>
                                </div>
                                <div className="w-8">
                                    <Link 
                                        href="#" 
                                        onClick={closeSidebar} 
                                        target="_blank" 
                                        aria-label="Join Bella Passi to get offers"
                                        prefetch={false}
                                    >
                                        <Image 
                                            width={32} 
                                            height={32} 
                                            src="/img/telegram-512.webp" 
                                            alt="" 
                                            className="img-fluid" 
                                            aria-label="Join to get offers" 
                                            loading="lazy"
                                        />
                                    </Link>
                                </div>
                            </div>
                            
                            {!token ? (
                                <div className="h-6 bg-gray-100 leftside-sigh">
                                    <div className="d-flex justify-around text-sss-primary-500">
                                        <div className="underline-offset-4">
                                            <Link href="/login" onClick={closeSidebar} prefetch={false}>
                                                Sign In
                                            </Link>
                                        </div>
                                        <div className="underline-offset-4">
                                            <Link href="/login" onClick={closeSidebar} prefetch={false}>
                                                Login
                                            </Link>
                                        </div>
                                    </div>
                                </div> 
                            ) : (                                    
                                <div className="h-6 bg-gray-100 leftside-sigh">
                                    <div className="d-flex justify-around text-sss-primary-500">
                                        <div className="underline-offset-4">
                                            <Link href="/user/dashboard" onClick={closeSidebar} prefetch={false}>
                                                My Account
                                            </Link>
                                        </div>
                                    </div>
                                </div> 
                            )}
                            
                            <div className="p-4 page-link bg-white">
                                {[
                                    { icon: 'bi-house-door', text: 'My Account', href: token ? '/user/dashboard' : '/login' },
                                    { icon: 'bi-cart', text: 'My Orders', href: token ? '/user/dashboard' : '/login' },
                                    { icon: 'bi-envelope', text: 'My Support', href: '#' },
                                    { icon: 'bi-award', text: 'My Coupon', href: '#' },
                                    { icon: 'bi-fire', text: 'My Refunds', href: '#' },
                                    { icon: 'bi-credit-card', text: 'Contact Details', href: '#' }
                                ].map((item, index) => (
                                    <div key={index} className="d-flex flex-row py-2.5">
                                        <div>
                                            <Link 
                                                href={item.href} 
                                                onClick={closeSidebar} 
                                                className="inline-block no-underline hover:text-black"
                                                prefetch={false}
                                            >
                                                <i className={`bi ${item.icon}`}></i>
                                            </Link>
                                        </div>
                                        <Link 
                                            href={item.href} 
                                            onClick={closeSidebar}
                                            prefetch={false}
                                        >
                                            <p className="font-semibold px-2 text-sm p-0 m-0">
                                                {item.text}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="accordion sidebar-accordion" id="accordionExample">
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
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    Returns &amp; Exchange
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    Shipping Policy
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    FAQ
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
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
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    About US
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    Our Stores
                                                </Link>
                                            </div>
                                            <div className="p-2 text-sm">
                                                <Link href="#" className="" onClick={closeSidebar} prefetch={false}>
                                                    Privacy Policy
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        
                        {/* Rest of your navbar content */}
                        <Link href="/" className="logo d-flex align-items-center" onClick={closeSidebar} prefetch={false}>
                            <Image src="/img/logo7.webp" width={195} height={25} alt="logo" loading="lazy" unoptimized/>
                        </Link>

                            <form className="search-form desktop-search-form"  onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Search for products" onFocus={handleFocus}
          value={searchQuery}
          onChange={handleChange}/>

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
                                <Link href="/user/dashboard" className="header-action-btn" onClick={closeSidebar} prefetch={false}>
                                    <i className="bi bi-person"></i>
                                </Link>
                            ) : (
                                <Link href="/login" className="header-action-btn" onClick={closeSidebar} prefetch={false}>
                                    <i className="bi bi-person"></i>
                                </Link>
                            )}
                                    
                                

                            <Link href="/contact" className="header-action-btn d-none d-md-block" onClick={closeSidebar} prefetch={false}>
                                <i className="bi bi-heart"></i>
                                <span className="badge">0</span>
                            </Link>

                            <Link href="/cart" className="header-action-btn" onClick={closeSidebar} prefetch={false}>
                                <i className="bi bi-cart3"></i>
                                <span className="badge">{cartCount}</span>
                            </Link>

                            

                        </div>
                    </div>
                </div>
            </div>
            
            {/* Add CSS styles for the custom sidebar */}
            <style jsx global>{`
                .custom-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 320px;
                    height: 100vh;
                    background: white;
                    z-index: 1050;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                    overflow-y: auto;
                    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
                }
                
                .custom-sidebar.show {
                    transform: translateX(0);
                }
                
                .custom-sidebar.closing {
                    transform: translateX(-100%);
                }
                
                .custom-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.5);
                    z-index: 1040;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                
                .custom-backdrop.fade-in {
                    opacity: 1;
                }
                
                .custom-backdrop.fade-out {
                    opacity: 0;
                }
                
                .sidebar-header {
                    display: flex;
                    justify-content: flex-end;
                    padding: 1rem;
                }
                
                .sidebar-close-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                }
                
                .sidebar-close-btn:hover {
                    color: #000;
                }
                
                .nav-tab {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    background: none;
                    border: none;
                    border-bottom: 1px solid #dee2e6;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .nav-tab:hover,
                .nav-tab.active {
                    background-color: #f8f9fa;
                    color: #495057;
                }
                
                .nav-tab.active {
                    font-weight: 600;
                }
                
                /* Custom accordion styles */
                .custom-accordion .accordion-button {
                    width: 100%;
                    padding: 1rem;
                    text-align: left;
                    background: #f8f9fa;
                    border: none;
                    cursor: pointer;
                    position: relative;
                }
                
                .custom-accordion .accordion-button::after {
                    content: '+';
                    position: absolute;
                    right: 1rem;
                    font-size: 1.2rem;
                }
                
                .custom-accordion .accordion-button[aria-expanded="true"]::after {
                    content: '-';
                }
                
                .custom-accordion .accordion-collapse {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                
                .custom-accordion .accordion-collapse.show {
                    max-height: 500px;
                }
                
                @media (max-width: 768px) {
                    .custom-sidebar {
                        width: 280px;
                    }
                }
            `}</style>
        </header>
    );
}