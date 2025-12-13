"use client";
import { AccountSidebarProps } from '../../../types';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

export const AccountSidebar = ({}: AccountSidebarProps) => {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);

    useEffect(() => {
        setFirstName(localStorage.getItem("user_first_name"));
        setLastName(localStorage.getItem("user_last_name"));
    }, []);
    const menuItems = [
        { name: "My Orders", path: "/user/dashboard", icon: "bi bi-box-seam" },
        { name: "My Address", path: "/user/my-address", icon: "bi bi-geo-alt" },
        { name: "Account Settings", path: "/user/account-setting", icon: "bi bi-gear" },
        { name: "Wishlist", path: "/", icon: "bi bi-heart" },
    ];
    const handleLogout = () => {
        signOut({ redirect: true, callbackUrl: "/" }); // Redirect after logout
    };
    return (
        <div className="profile-menu collapse d-lg-block mobile-hide-profile-sidebar" id="profileMenu">
            <div className="user-info aos-init aos-animate" data-aos="fade-right">
                <div className="user-avatar">
                    <Image 
                        src="/img/ava3-bg.webp" 
                        height={88} 
                        width={88} 
                        alt="Profile" 
                        loading="lazy"
                    />
                </div>
                <h4>{firstName} {lastName}</h4>    
            </div>

            <nav className="menu-nav">
                <ul className="nav flex-column dashboard-nav" role="tablist">
                    {menuItems.map((item) => (
                        <li key={item.path} className="nav-item" role="presentation" >
                            <Link className="nav-link" href={item.path}>
                                <i className={item.icon}></i>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="menu-footer">
                    
                        <button type="button" onClick={handleLogout} className="logout-link">
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Log Out</span>
                        </button>
                    
                </div>
            </nav>
        </div>
    );
};