"use client";
import { AccountSidebarProps } from '../../../types';
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

export const MobileAccountSidebar = ({}: AccountSidebarProps) => {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);

    useEffect(() => {
        setFirstName(localStorage.getItem("user_first_name"));
        setLastName(localStorage.getItem("user_last_name"));
    }, []);
    const menuItems = [
        { name: "My Orders", path: "/user/dashboard", icon: "bi bi-box-seam" },
        { name: "Wishlist", path: "/", icon: "bi bi-heart" },
        { name: "My Address", path: "/user/my-address", icon: "bi bi-geo-alt" },
        { name: "Account Settings", path: "/user/account-setting", icon: "bi bi-gear" },
    ];
    const handleLogout = () => {
        signOut({ redirect: true, callbackUrl: "/" }); // Redirect after logout
    };
    return (
        <div className="profile-menu mobile-profile-menu d-lg-block" id="profileMenu">
            
            <div id="tabs" className="d-flex justify-between border-t">

                <Link aria-current="page" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1 nuxt-link-exact-active nuxt-link-active" href="/user/dashboard">
                    <i className="bi bi-box-seam"></i>
                    <span className="tab tab-home block text-xs">My Orders</span>
                </Link>

                <Link aria-current="page" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1 nuxt-link-exact-active nuxt-link-active" href="#">
                    <i className="bi bi-heart"></i>
                    <span className="tab tab-home block text-xs">Wishlist</span>
                </Link>

                <Link aria-current="page" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1 nuxt-link-exact-active nuxt-link-active" href="/user/my-address">
                    <i className="bi bi-geo-alt"></i>
                    <span className="tab tab-home block text-xs">My Address</span>
                </Link>

                <Link aria-current="page" className="w-full focus:text-sss-primary-500 hover:text-blacktext-sss-primary-500 justify-center inline-block text-center pt-2 pb-1 nuxt-link-exact-active nuxt-link-active" href="/user/account-setting">
                    <i className="bi bi-gear"></i>
                    <span className="tab tab-home block text-xs">Account Settings</span>
                </Link>
            </div>

        </div>
    );
};