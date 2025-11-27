import { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../styles/assets/vendor/swiper/swiper-bundle.min.css';
  

import "../styles/color.css";
import "../styles/custom.css";
import "../styles/main.css";


import BootstrapClient from "@/components/BootstrapClient"; //bootstrap bundle js load

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Toaster } from "react-hot-toast";
import TopLoader from "../components/common/TopLoader";
import NextTopLoader from 'nextjs-toploader';

import SessionProvider from '../components/SessionProvider';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { Suspense } from "react";


export const metadata = {
  title: 'Bella Passi - Online Fashion | Best Fashion Deals In India',
  description: 'Affordable fashion deals for all seasons and styles',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  console.log("SECRET", process.env.NEXTAUTH_SECRET);
  const session = await getServerSession(authOptions); // ✔ Works
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <SessionLoader />
          {/* Load Bootstrap JS on client */}
          <BootstrapClient />
          <NextTopLoader color="#29d" height={3} />
          <Navbar />

          <main className="container py-4">
            <TopLoader />   {/* enable top loading bar */}
            {children}
          </main>
          <Toaster position="top-right" reverseOrder={false} />
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
async function SessionLoader() {
  const session = await getServerSession(authOptions);
  return null;
}

